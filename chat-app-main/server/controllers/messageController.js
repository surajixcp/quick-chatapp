import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js"
import { io, userSocketMap } from "../server.js"

// Get all users except the logged in user
export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch current user to get friends list
        const currentUser = await User.findById(userId).populate('friends', '-password');

        // filteredUsers are now just the friends
        const filteredUsers = currentUser.friends || [];

        // count number of messages not seen
        const unseenMessages = {}
        const promises = filteredUsers.map(async (user) => {
            const message = await Message.find({ senderId: user._id, receiverId: userId, seen: false })
            if (message.length > 0) {
                unseenMessages[user._id] = message.length;
            }
        })
        await Promise.all(promises);
        res.json({ success: true, users: filteredUsers, unseenMessages })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Get all message for selected user
export const getMessages = async (req, res) => {
    try {
        const { id: selectedId } = req.params;
        const myId = req.user._id;

        // Check if selectedId is a Group
        const isGroup = await import("../models/Group.js").then(m => m.default.findById(selectedId));

        let messages;
        if (isGroup) {
            messages = await Message.find({ groupId: selectedId }).populate("senderId", "fullName profilePic");
        } else {
            messages = await Message.find({
                $or: [
                    { senderId: myId, receiverId: selectedId },
                    { receiverId: myId, senderId: selectedId },
                ],
                deletedFor: { $ne: myId }
            })
        }

        // if not group mark as seen (simplified logic)
        if (!isGroup) {
            await Message.updateMany({ senderId: selectedId, receiverId: myId },
                { seen: true })
        }

        res.json({ success: true, messages })
    }

    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

//  api to mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true })
        res.json({ success: true })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Send message to selected user
export const sendMessage = async (req, res) => {
    try {
        const { text, image, isForwarded } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // Check if blocked
        const receiverUser = await User.findById(receiverId);
        if (receiverUser.blockedUsers.includes(senderId)) {
            return res.json({ success: false, message: "You are blocked by this user" });
        }

        // Check if sender blocked receiver (optional, usually you can't message someone you blocked)
        const senderUser = await User.findById(senderId);
        if (senderUser.blockedUsers.includes(receiverId)) {
            return res.json({ success: false, message: "Unblock user to send message" });
        }

        // Check if receiverId is a Group
        const isGroup = await import("../models/Group.js").then(m => m.default.findById(receiverId));

        console.log('Send message request:', { senderId, receiverId, text: text ? text.substring(0, 50) + '...' : 'no text', hasImage: !!image, isGroup: !!isGroup });

        let imageUrl;
        if (image && !isForwarded) {
            // If it's a new upload
            if (image.startsWith("data:")) {
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageUrl = uploadResponse.secure_url;
            } else {
                imageUrl = image; // Assume it's already a URL (forwarded)
            }
        } else if (image) {
            imageUrl = image;
        }

        const newMessageData = {
            senderId,
            text,
            image: imageUrl,
            isForwarded
        };

        if (isGroup) {
            newMessageData.groupId = receiverId;
        } else {
            newMessageData.receiverId = receiverId;
        }

        const newMessage = await Message.create(newMessageData);

        // Populate sender info for group chat
        if (isGroup) {
            await newMessage.populate("senderId", "fullName profilePic");
        }

        console.log('Message created:', newMessage._id);

        if (isGroup) {
            // Emit to all group members
            isGroup.members.forEach(memberId => {
                if (memberId.toString() !== senderId.toString()) {
                    const memberSocketId = userSocketMap[memberId];
                    if (memberSocketId) {
                        io.to(memberSocketId).emit("newMessage", newMessage);
                    }
                }
            });
        } else {
            // Emit the new message to the receiver's socket
            const receiverSocketId = userSocketMap[receiverId];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage)
            }
        }

        res.json({ success: true, newMessage })
    } catch (error) {
        console.log('Send message error:', error.message);
        res.json({ success: false, message: error.message })
    }
}

// Delete message
export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { deleteType } = req.body; // 'me' or 'everyone'
        const userId = req.user._id;

        const message = await Message.findById(id);
        if (!message) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }

        if (deleteType === 'me') {
            await Message.findByIdAndUpdate(id, {
                $push: { deletedFor: userId }
            });
        } else if (deleteType === 'everyone') {
            if (message.senderId.toString() !== userId.toString()) {
                return res.status(403).json({ success: false, message: "You can only delete your own messages for everyone" });
            }
            await Message.findByIdAndUpdate(id, {
                isDeletedForEveryone: true
            });
            // Emit the deleted message event
            const receiverId = message.senderId.toString() === userId.toString() ? message.receiverId : message.senderId;
            const receiverSocketId = userSocketMap[receiverId];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("messageDeleted", { messageId: id, isDeletedForEveryone: true });
            }
        }

        res.json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
        console.log("Delete message error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}
