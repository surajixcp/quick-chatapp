import Group from "../models/Group.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";

export const createGroup = async (req, res) => {
    try {
        const { name, description, members } = req.body;
        const admin = req.user._id;

        if (!name || !members || members.length === 0) {
            return res.status(400).json({ success: false, message: "Name and members are required" });
        }

        const newGroup = await Group.create({
            name,
            description,
            members: [...members, admin], // Add admin to members
            admin,
        });

        const populatedGroup = await Group.findById(newGroup._id).populate("members", "-password").populate("admin", "-password");

        res.status(201).json({ success: true, group: populatedGroup });
    } catch (error) {
        console.log("Create group error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserGroups = async (req, res) => {
    try {
        const userId = req.user._id;
        const groups = await Group.find({ members: userId })
            .populate("members", "-password")
            .populate("admin", "-password")
            .populate("restrictedUsers", "_id fullName") // Populate for frontend check
            .sort({ updatedAt: -1 });
        res.json({ success: true, groups });
    } catch (error) {
        console.log("Get user groups error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateGroup = async (req, res) => {
    try {
        const { groupId, name, image, description } = req.body;
        const userId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ success: false, message: "Group not found" });
        }

        if (group.admin.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Only admin can update group" });
        }

        let updatedData = { name, description };

        if (image) {
            const upload = await cloudinary.uploader.upload(image);
            updatedData.image = upload.secure_url;
        }

        const updatedGroup = await Group.findByIdAndUpdate(groupId, updatedData, { new: true })
            .populate("members", "-password")
            .populate("admin", "-password");

        res.json({ success: true, group: updatedGroup, message: "Group updated successfully" });

    } catch (error) {
        console.log("Update group error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addMember = async (req, res) => {
    try {
        const { groupId, userId } = req.body;
        const adminId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ success: false, message: "Group not found" });

        if (group.admin.toString() !== adminId.toString()) {
            return res.status(403).json({ success: false, message: "Only admin can add members" });
        }

        if (group.members.includes(userId)) {
            return res.status(400).json({ success: false, message: "User already in group" });
        }

        group.members.push(userId);
        await group.save();

        const updatedGroup = await Group.findById(groupId).populate("members", "-password").populate("admin", "-password");

        res.json({ success: true, group: updatedGroup, message: "Member added successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const removeMember = async (req, res) => {
    try {
        const { groupId, userId } = req.body;
        const adminId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ success: false, message: "Group not found" });

        if (group.admin.toString() !== adminId.toString()) {
            return res.status(403).json({ success: false, message: "Only admin can remove members" });
        }

        group.members = group.members.filter(id => id.toString() !== userId);
        await group.save();

        const updatedGroup = await Group.findById(groupId).populate("members", "-password").populate("admin", "-password");

        res.json({ success: true, group: updatedGroup, message: "Member removed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ success: false, message: "Group not found" });

        if (group.admin.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Only admin can delete group" });
        }

        await Group.findByIdAndDelete(groupId);

        res.json({ success: true, message: "Group deleted successfully", groupId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const toggleGroupPermission = async (req, res) => {
    try {
        const { groupId, userId } = req.body;
        const adminId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ success: false, message: "Group not found" });

        if (group.admin.toString() !== adminId.toString()) {
            return res.status(403).json({ success: false, message: "Only admin can change permissions" });
        }

        if (!group.restrictedUsers) group.restrictedUsers = [];

        const isRestricted = group.restrictedUsers.some(id => id.toString() === userId);

        if (isRestricted) {
            // Un-restrict (allow text)
            group.restrictedUsers = group.restrictedUsers.filter(id => id.toString() !== userId);
        } else {
            // Restrict (read only)
            group.restrictedUsers.push(userId);
        }

        await group.save();

        const updatedGroup = await Group.findById(groupId)
            .populate("members", "-password")
            .populate("admin", "-password")
            .populate("restrictedUsers", "fullName profilePic"); // Optional, but helps frontend if needed

        res.json({ success: true, group: updatedGroup, message: "Permissions updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const toggleAllGroupPermissions = async (req, res) => {
    try {
        const { groupId, action } = req.body; // action: 'restrict' | 'unrestrict'
        const userId = req.user._id;

        const group = await Group.findById(groupId);

        if (!group) return res.status(404).json({ message: "Group not found" });

        if (group.admin.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Only admin can change permissions" });
        }

        if (action === 'restrict') {
            // Add all members except admin to restricted list
            group.restrictedUsers = group.members.filter(memberId => memberId.toString() !== group.admin.toString());
        } else {
            // Clear list
            group.restrictedUsers = [];
        }

        await group.save();

        // Return fully populated group
        const updatedGroup = await Group.findById(groupId)
            .populate("members", "-password")
            .populate("admin", "-password")
            .populate("restrictedUsers", "_id fullName");

        res.json({ success: true, group: updatedGroup });

    } catch (error) {
        console.log("Error toggling all permissions:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
