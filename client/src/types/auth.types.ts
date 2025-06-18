import { z } from "zod";
import { signupSchema, signinSchema } from "../schemas/auth.schemas";
import type { User } from "firebase/auth";

export type SignupFormData = z.infer<typeof signupSchema>;
export type SigninFormData = z.infer<typeof signinSchema>;

export interface SignupData {
  fullname: string;
  username: string;
  email: string;
  password: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface AuthResponse {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  avatar: {
    url: string;
    publicId: string | null;
  };
}

export interface GoogleAuthData {
  name: string;
  email: string;
  avatar: string;
}

export interface AuthResult {
  user: User;
  providerId?: string;
  operationType?: string;
}
