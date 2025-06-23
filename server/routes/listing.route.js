import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createListing,
  deleteListing,
  getListingById,
  updateListing,
  searchListings,
} from "../controllers/listing.controller.js";

const upload = multer({ storage: multer.memoryStorage() });
const listingRouter = express.Router();

listingRouter.get("/search", verifyToken, searchListings);

// Create listing with multiple image uploads
listingRouter.post(
  "/:userId/create",
  verifyToken,
  upload.array("images", 4),
  createListing
);

// Get single listing by ID (PUBLIC ROUTE - no auth required)
listingRouter.get("/:listingId", getListingById);

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
