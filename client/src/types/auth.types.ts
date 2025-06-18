import { z } from "zod";
import { signupSchema, signinSchema } from "../schemas/auth.schemas";
import type { User } from "firebase/auth";

export type SignupFormData = z.infer<typeof signupSchema>;
export type SigninFormData = z.infer<typeof signinSchema>;

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface AuthResponse {
  username?: string;
  email: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
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

export interface GoogleAuthResponse {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  avatar: string;
}
