import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { createError } from "../utils/error.util.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return next(createError(401, "You are not authenticated."));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(createError(401, "User not found."));
    }

    // Check if route has user ID parameter and validate it
    if (req.params.userId) {
      if (req.params.userId !== decoded.id) {
        return next(
          createError(
            403,
            "Access denied. You can only access your own resources."
          )
        );
      }
    }

    req.user = { id: user._id };
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    next(error);
  }
};
