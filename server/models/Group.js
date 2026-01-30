import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    restrictedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who can only see messages
    image: { type: String, default: "" },
}, { timestamps: true });

const Group = mongoose.model("Group", groupSchema);

export default Group;
