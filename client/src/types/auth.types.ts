import { z } from "zod";
import { signupSchema } from "../schemas/auth.schemas";

export type SignupFormData = z.infer<typeof signupSchema>;

export interface SignupData {
  username: string;
  email: string;
  password: string;
}
