import type {
  SignupData,
  SigninData,
  AuthResponse,
  GoogleAuthData,
} from "../types/auth.types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

  signin: async (data: SigninData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important for cookies
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Signin failed");
    }

    return result;
  },

  googleAuth: async (data: GoogleAuthData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Google authentication failed");
    }

    return result;
  },
  signOut: async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/auth/signout`, {
        method: "POST",
        credentials: "include", // This will include the httpOnly cookie
      });
    } catch (error) {
      console.error("Sign out error:", error);
      // Still clear local state even if API call fails
    }
  },
};
