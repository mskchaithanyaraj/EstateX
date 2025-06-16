import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { capitalize, createError } from "../utils/error.util.js";

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
