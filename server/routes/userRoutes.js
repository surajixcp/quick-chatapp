import express from "express";
import { checkAuth, login, signup, updateProfile, deleteAccount, searchUser, addFriend, blockUser, unblockUser, removeFriend, fixUsernames } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkAuth);
userRouter.delete("/delete", protectRoute, deleteAccount);
userRouter.get("/search", protectRoute, searchUser);
userRouter.post("/add-friend", protectRoute, addFriend);
userRouter.post("/block", protectRoute, blockUser);
userRouter.post("/unblock", protectRoute, unblockUser);
userRouter.post("/remove-friend", protectRoute, removeFriend);
userRouter.get("/fix-usernames", fixUsernames); // Open route for quick fix

export default userRouter;