import User from "../models/User.model.js";

// Enhanced username generation with uniqueness check
export const generateUniqueUsername = async (name) => {
  const baseUsername = name.split(" ").join("").toLowerCase();
  let username = baseUsername + Math.random().toString(36).slice(-4);
  let attempts = 0;
  const maxAttempts = 10; // Prevent infinite loops

  // Keep generating until we find a unique username
  while (attempts < maxAttempts) {
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return username; // Username is unique
    }

    // Username exists, generate a new one
    attempts++;
    const randomSuffix = Math.random().toString(36).slice(-6); // Longer suffix for better uniqueness
    username = baseUsername + randomSuffix;
  }

  // Fallback: add timestamp if all attempts failed
  const timestamp = Date.now().toString().slice(-6);
  username = baseUsername + timestamp;

  return username;
};
