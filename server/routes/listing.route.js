import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createListing } from "../controllers/listing.controller.js";

const upload = multer({ storage: multer.memoryStorage() });
const listingRouter = express.Router();

// Apply auth middleware to all routes
listingRouter.use(verifyToken);

// Create listing with multiple image uploads
listingRouter.post("/create", upload.array("images", 4), createListing);

export default listingRouter;
