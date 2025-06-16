import type { SignupData } from "../types/auth.types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const authAPI = {
  signup: async (data: SignupData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Signup failed");
    }

    return result;
  },
};
