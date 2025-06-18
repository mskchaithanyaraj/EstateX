import express from "express";
import { signin, signup, googleAuth } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/google", googleAuth);

export default authRouter;
