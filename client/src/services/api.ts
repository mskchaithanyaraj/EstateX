import type { User } from "../redux/user/userSlice";
import type {
  SignupData,
  SigninData,
  AuthResponse,
  GoogleAuthData,
} from "../types/auth.types";
import type {
  ChangePasswordData,
  UpdateProfileData,
} from "../types/profile.types";

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
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
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

export const profileAPI = {
  uploadAvatar: async (
    file: File,
    currentUser: User
  ): Promise<{ avatarUrl: string }> => {
    const form = new FormData();
    form.append("avatar", file);
    form.append("userId", currentUser.id);

    const res = await fetch(`${API_BASE_URL}/user/${currentUser.id}/avatar`, {
      method: "PATCH",
      credentials: "include",
      body: form,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  updateProfile: async (
    data: UpdateProfileData,
    userId: string
  ): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/user/${userId}/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update profile");
    }

    return result;
  },

  changePassword: async (
    data: ChangePasswordData,
    userId: string
  ): Promise<{ message: string }> => {
    const response = await fetch(
      `${API_BASE_URL}/user/${userId}/change-password`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to change password");
    }

    return result;
  },
  deleteUser: async (userId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/user/${userId}/delete`, {
      method: "DELETE",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete user");
    }

    return result;
  },
};
