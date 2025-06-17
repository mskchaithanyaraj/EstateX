import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { capitalize, createError } from "../utils/error.util.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    // Detect MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]; // e.g., "email" or "username"
      return next(createError(409, `${capitalize(field)} already exists`));
    }
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    const { password: pass, ...userDetails } = user._doc; // Exclude password from user details
    if (!user) {
      return next(createError(404, "User not found, please sign up"));
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(createError(401, "Invalid credentials"));
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json(userDetails);
  } catch (error) {
    return next(error);
  }
};
