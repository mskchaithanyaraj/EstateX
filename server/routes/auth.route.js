import express from "express";
import {
  signin,
  signup,
  signout,
  googleAuth,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/signout", signout);
authRouter.post("/google", googleAuth);

export default authRouter;
