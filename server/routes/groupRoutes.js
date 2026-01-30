import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { createGroup, getUserGroups, updateGroup } from "../controllers/groupController.js";

const groupRouter = express.Router();

groupRouter.post("/create", protectRoute, createGroup);
groupRouter.put("/update", protectRoute, updateGroup);
groupRouter.get("/", protectRoute, getUserGroups);

export default groupRouter;
