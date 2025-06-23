import express from "express";
import {
  signin,
  signup,
  signout,
  googleAuth,
  wakeUp,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/signout", signout);
authRouter.post("/google", googleAuth);
authRouter.get("/wake-up", wakeUp);

export default authRouter;
