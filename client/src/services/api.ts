import type { User } from "../redux/user/userSlice";
import type {
  SignupData,
  SigninData,
  AuthResponse,
  GoogleAuthData,
} from "../types/auth.types";
import type {
  CreateListingData,
  Listing,
  ListingResponse,
} from "../types/listing.types";
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
  wakeUpServer: async (): Promise<{
    message: string;
    timestamp: string;
    status: string;
  }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/wake-up`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // No credentials needed for wake-up call
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Wake-up failed");
      }

      return result;
    } catch (error) {
      // Silently fail - we don't want to show errors for wake-up calls
      console.log("🔄 Server wake-up call made");
      throw error;
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

export const listingAPI = {
  createListing: async (
    data: CreateListingData,
    id: string
  ): Promise<ListingResponse> => {
    const formData = new FormData();

    // Append text fields
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("location", data.location);
    formData.append("type", data.type);
    formData.append(
      "houseSpecifications",
      JSON.stringify(data.houseSpecifications)
    );

    if (data.sellingPrice) {
      formData.append("sellingPrice", data.sellingPrice.toString());
    }
    if (data.rentalPrice) {
      formData.append("rentalPrice", data.rentalPrice.toString());
    }
    if (data.discountedPrice) {
      formData.append("discountedPrice", data.discountedPrice.toString());
    }

    // Append images
    if (data.images) {
      data.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await fetch(`${API_BASE_URL}/listing/${id}/create`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create listing");
    }

    return result;
  },
  getListings: async (userId: string): Promise<Listing[]> => {
    const response = await fetch(`${API_BASE_URL}/user/${userId}/listings`, {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch listings");
    }

    return result;
  },
  getListingById: async (listingId: string): Promise<Listing> => {
    const response = await fetch(`${API_BASE_URL}/listing/${listingId}`, {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch listing");
    }

    return result;
  },

  updateListing: async (
    listingId: string,
    data: CreateListingData
  ): Promise<ListingResponse> => {
    const formData = new FormData();

    // Append text fields
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("location", data.location);
    formData.append("type", data.type);
    formData.append(
      "houseSpecifications",
      JSON.stringify(data.houseSpecifications)
    );

    if (data.sellingPrice) {
      formData.append("sellingPrice", data.sellingPrice.toString());
    }
    if (data.rentalPrice) {
      formData.append("rentalPrice", data.rentalPrice.toString());
    }
    if (data.discountedPrice) {
      formData.append("discountedPrice", data.discountedPrice.toString());
    }

    // Append new images if any
    if (data.images) {
      data.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/listing/${listingId}/update`,
      {
        method: "PUT",
        credentials: "include",
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update listing");
    }

    return result;
  },
  deleteListing: async (listingId: string): Promise<{ message: string }> => {
    const response = await fetch(
      `${API_BASE_URL}/listing/${listingId}/delete`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete listing");
    }

    return result;
  },
  searchListings: async (
    filters: Record<string, string | number | boolean | undefined>
  ): Promise<Listing[]> => {
    const searchParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        searchParams.set(key, value.toString());
      }
    });

    const response = await fetch(
      `${API_BASE_URL}/listing/search?${searchParams.toString()}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to search listings");
    }

    return result;
  },
  searchByLocation: async (location: string): Promise<Listing[]> => {
    const searchParams = new URLSearchParams();
    searchParams.set("location", location);

    const response = await fetch(
      `${API_BASE_URL}/listing/search?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to search listings");
    }

    return result;
  },
};

export const userAPI = {
  getUserById: async (userId: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch user");
    }

    return result;
  },
};
