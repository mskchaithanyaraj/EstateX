import express from "express";
import multer from "multer";

import { verifyToken } from "../middleware/authMiddleware.js";
import {
  updateAvatar,
  updatePassword,
  updateProfile,
  deleteUser,
  getUserListings,
  getUser,
} from "../controllers/user.controller.js";

const upload = multer({ storage: multer.memoryStorage() });
const userRouter = express.Router();

// Avatar upload
userRouter.patch(
  "/:userId/avatar",
  verifyToken,
  upload.single("avatar"),
  updateAvatar
);

// Update profile (fullname and username only)
userRouter.patch("/:userId/profile", verifyToken, updateProfile);

// Change password
userRouter.patch("/:userId/change-password", verifyToken, updatePassword);

userRouter.delete("/:userId/delete", verifyToken, deleteUser);

userRouter.get("/:userId/listings", verifyToken, getUserListings);

userRouter.get("/:id", verifyToken, getUser);

export default userRouter;
