import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";


// Signup a new user
export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: "Missing Details" })
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.json({ success: false, message: "User already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate Username
        const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
        const baseName = fullName.replace(/\s+/g, '').toLowerCase().slice(0, 10);
        let username = `${baseName}${uniqueSuffix}`;

        // Ensure uniqueness (simple retry)
        while (await User.findOne({ username })) {
            const newSuffix = Math.floor(1000 + Math.random() * 9000);
            username = `${baseName}${newSuffix}`;
        }

        const newUser = await User.create({
            fullName, email, password: hashedPassword, bio, username
        })
        const token = generateToken(newUser._id);

        res.json({
            success: true, userData: newUser, token,
            message: "Account created successfully"
        })

    } catch (error) {
        console.log(error.message)
        res.json({
            success: false,
            message: error.message
        })
    }
}

// ... existing login ...
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email })

        if (!userData) {
            return res.json({ success: false, message: "User not found" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password)

        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Login unsuccessful" })
        }

        const token = generateToken(userData._id);

        res.json({
            success: true, userData, token,
            message: "Login successful"
        })

    } catch (error) {
        console.log(error.message)
        res.json({
            success: false,
            message: error.message
        })
    }
}

// Controller to check if user is authenticated
export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('blockedUsers');
        if (!user.blockedUsers) user.blockedUsers = [];
        if (!user.friends) user.friends = [];
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// ... existing updateProfile ...
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;

        const userId = req.user._id;
        let updatedUser;

        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName },
                { new: true }
            )
        } else {
            const upload = await cloudinary.uploader.upload(profilePic)

            updatedUser = await User.findByIdAndUpdate(userId, { profilePic: upload.secure_url, bio, fullName },
                { new: true });
        }
        res.json({ success: true, user: updatedUser })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, user: error.message })
    }
}

// ... existing deleteAccount ...
export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;

        await User.findByIdAndDelete(userId);

        res.json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
        console.log("Delete account error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Search user by username
export const searchUser = async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) return res.json({ success: false, message: "Username required" });

        console.log(`Searching for user: "${username}"`);

        // Case-insensitive search
        const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } }).select("-password");

        if (!user) {
            console.log("User not found in DB");
            return res.json({ success: false, message: "User not found" });
        }
        console.log("User found:", user.username);

        // Check if already friends
        const currentUser = await User.findById(req.user._id);
        const isFriend = currentUser.friends?.some(id => id.toString() === user._id.toString()) || false;

        res.json({ success: true, user: { ...user.toObject(), isFriend } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add friend (existing)
export const addFriend = async (req, res) => {
    try {
        const { friendId } = req.body;
        const userId = req.user._id;

        if (userId.toString() === friendId) {
            return res.json({ success: false, message: "Cannot add yourself" });
        }

        const user = await User.findById(userId);
        if (!user.friends) user.friends = []; // Initialize if missing

        if (user.friends.some(id => id.toString() === friendId)) {
            return res.json({ success: false, message: "User already in your connections" });
        }

        user.friends.push(friendId);
        await user.save();

        // Bidirectional
        const friend = await User.findById(friendId);
        if (friend) {
            if (!friend.friends) friend.friends = []; // Initialize if missing
            if (!friend.friends.some(id => id.toString() === userId.toString())) {
                friend.friends.push(userId);
                await friend.save();
            }
        }

        res.json({ success: true, message: "User added to connections" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Block User
export const blockUser = async (req, res) => {
    try {
        const { id: blockId } = req.body;
        const userId = req.user._id;

        await User.findByIdAndUpdate(userId, {
            $addToSet: { blockedUsers: blockId }
        });

        res.json({ success: true, message: "User blocked" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Unblock User
export const unblockUser = async (req, res) => {
    try {
        const { id: unblockId } = req.body;
        const userId = req.user._id;

        await User.findByIdAndUpdate(userId, {
            $pull: { blockedUsers: unblockId }
        });

        res.json({ success: true, message: "User unblocked" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Remove Friend
export const removeFriend = async (req, res) => {
    try {
        const { id: removeId } = req.body;
        const userId = req.user._id;

        // Remove from current user's friend list
        await User.findByIdAndUpdate(userId, {
            $pull: { friends: removeId }
        });

        // Remove current user from the other user's friend list (bidirectional removal)
        await User.findByIdAndUpdate(removeId, {
            $pull: { friends: userId }
        });

        res.json({ success: true, message: "User removed from connections" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Temp Migration: Fix missing usernames
export const fixUsernames = async (req, res) => {
    try {
        const users = await User.find({ username: { $exists: false } });
        let count = 0;
        for (const user of users) {
            const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
            const baseName = user.fullName.replace(/\s+/g, '').toLowerCase().slice(0, 10);
            user.username = `${baseName}${uniqueSuffix}`;
            if (!user.friends) user.friends = [];
            if (!user.blockedUsers) user.blockedUsers = [];
            await user.save();
            count++;
        }
        res.json({ success: true, message: `Fixed ${count} users without usernames` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
