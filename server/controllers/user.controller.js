import cloudinary from "../utils/cloudinaryConfig.js"; // Fix path
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.util.js";
import Listing from "../models/Listing.model.js";

export const updateAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old avatar if exists
    if (user.avatar.publicId) {
      await cloudinary.uploader.destroy(user.avatar.publicId, {
        invalidate: true,
      });
    }

    const streamUpload = (fileBuffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "avatars",
            public_id: user._id.toString(),
            overwrite: true,
          },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(fileBuffer);
      });

    const result = await streamUpload(req.file.buffer);
    user.avatar = { url: result.secure_url, publicId: result.public_id };
    await user.save();

    res.json({ avatarUrl: result.secure_url });
  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({ message: "Failed to upload avatar" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, username } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if username is unique (if username is being changed)
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          message: "Username is already taken. Please choose a different one.",
        });
      }
    }

    // Update only provided fields
    if (fullname !== undefined) user.fullname = fullname;
    if (username !== undefined) user.username = username;

    await user.save();

    // Return updated user data (exclude password)
    const { password, ...userDetails } = user._doc;

    res.json({
      ...userDetails,
      _id: userDetails._id,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters long",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ message: "Failed to change password" });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete avatar from Cloudinary if it exists
    if (user.avatar.publicId) {
      await cloudinary.uploader.destroy(user.avatar.publicId, {
        invalidate: true,
      });
    }

    // Delete user from database
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("User deletion error:", error);
    next(createError(500, "Failed to delete user"));
  }
};

export const getUserListings = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch listings created by the user
    const listings = await Listing.find({ userId })
      .populate("userId", "fullname username avatar")
      .sort({ createdAt: -1 });

    if (!listings || listings.length === 0) {
      return res
        .status(404)
        .json({ message: "No listings found for this user" });
    }

    res.json(listings);
  } catch (error) {
    console.error("Error fetching user listings:", error);
    res.status(500).json({ message: "Failed to fetch user listings" });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch user by ID
    const user = await User.findById(userId)
      .select("-password")
      .populate("avatar");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};
