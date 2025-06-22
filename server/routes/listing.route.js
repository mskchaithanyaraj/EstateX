import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createListing,
  deleteListing,
  getListingById,
  updateListing,
} from "../controllers/listing.controller.js";

const upload = multer({ storage: multer.memoryStorage() });
const listingRouter = express.Router();

// Create listing with multiple image uploads
listingRouter.post(
  "/:userId/create",
  verifyToken,
  upload.array("images", 4),
  createListing
);

// Get single listing by ID
listingRouter.get("/:listingId", verifyToken, getListingById);

// Update listing
listingRouter.put(
  "/:listingId/update",
  verifyToken,
  upload.array("images", 4),
  updateListing
);

// Delete listing
listingRouter.delete("/:listingId/delete", verifyToken, deleteListing);

export default listingRouter;
