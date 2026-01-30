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
        const groups = await Group.find({ members: userId }).populate("members", "-password").populate("admin", "-password").sort({ updatedAt: -1 });
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
