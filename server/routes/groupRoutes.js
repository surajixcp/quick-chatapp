import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { createGroup, getUserGroups, updateGroup, addMember, removeMember, deleteGroup, toggleGroupPermission, toggleAllGroupPermissions } from "../controllers/groupController.js";

const groupRouter = express.Router();

groupRouter.post("/create", protectRoute, createGroup);
groupRouter.put("/update", protectRoute, updateGroup);
groupRouter.get("/", protectRoute, getUserGroups);
groupRouter.post("/add-member", protectRoute, addMember);
groupRouter.post("/remove-member", protectRoute, removeMember);
groupRouter.delete("/delete/:groupId", protectRoute, deleteGroup);
groupRouter.post("/toggle-permission", protectRoute, toggleGroupPermission);
groupRouter.post("/toggle-all-permissions", protectRoute, toggleAllGroupPermissions);

export default groupRouter;
