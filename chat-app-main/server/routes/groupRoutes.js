import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { createGroup, getUserGroups } from "../controllers/groupController.js";

const groupRouter = express.Router();

groupRouter.post("/create", protectRoute, createGroup);
groupRouter.get("/", protectRoute, getUserGroups);

export default groupRouter;
