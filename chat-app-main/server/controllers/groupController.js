import Group from "../models/Group.js";
import User from "../models/User.js";

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
