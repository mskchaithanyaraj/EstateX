import { z } from "zod";
import { signupSchema, signinSchema } from "../schemas/auth.schemas";

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
}
