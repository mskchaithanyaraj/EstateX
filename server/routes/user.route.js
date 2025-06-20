import express from "express";
import multer from "multer";

import { verifyToken } from "../middleware/authMiddleware.js";
import {
  updateAvatar,
  updatePassword,
  updateProfile,
  deleteUser,
} from "../controllers/user.controller.js";

const upload = multer({ storage: multer.memoryStorage() });
const userRouter = express.Router();

// Apply auth middleware to all routes
userRouter.use(verifyToken);

// Avatar upload
userRouter.patch("/avatar", upload.single("avatar"), updateAvatar);

// Update profile (fullname and username only)
userRouter.patch("/profile", updateProfile);

// Change password
userRouter.patch("/change-password", updatePassword);

userRouter.delete("/delete", deleteUser);

export default userRouter;
