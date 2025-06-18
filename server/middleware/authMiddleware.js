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

    req.user = { id: user._id };
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    next(error);
  }
};
