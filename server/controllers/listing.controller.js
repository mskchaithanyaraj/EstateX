import mongoose from "mongoose";
import cloudinary from "../utils/cloudinaryConfig.js";
import { createError } from "../utils/error.util.js";
import Listing from "../models/Listing.model.js";

export const createListing = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      title,
      description,
      sellingPrice,
      rentalPrice,
      discountedPrice,
      location,
      type,
      houseSpecifications,
    } = req.body;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(createError(400, "Invalid user ID"));
    }

    // Parse houseSpecifications if it's a string
    let parsedHouseSpecs;
    try {
      parsedHouseSpecs =
        typeof houseSpecifications === "string"
          ? JSON.parse(houseSpecifications)
          : houseSpecifications;
    } catch (error) {
      return next(createError(400, "Invalid house specifications format"));
    }

    // Validate required fields
    if (
      !title.trim() ||
      !description.trim() ||
      !location.trim() ||
      !type ||
      !parsedHouseSpecs
    ) {
      return next(createError(400, "All required fields must be provided"));
    }

    // Validate type enum
    if (!["rent", "sale"].includes(type)) {
      return next(createError(400, "Type must be either 'rent' or 'sale'"));
    }

    // Validate price based on type
    if (type === "sale") {
      if (!sellingPrice || sellingPrice <= 0) {
        return next(
          createError(400, "Valid selling price is required for sale listings")
        );
      }
      if (discountedPrice && discountedPrice >= sellingPrice) {
        return next(
          createError(400, "Discounted price must be less than selling price")
        );
      }
    }

    if (type === "rent") {
      if (!rentalPrice || rentalPrice <= 0) {
        return next(
          createError(400, "Valid rental price is required for rent listings")
        );
      }
    }

    // Create folder name based on userId and title
    const sanitizedTitle = title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-") // Replace non-alphanumeric with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

    const folderPath = `listings/${userId}/${sanitizedTitle}`;

    // Handle image uploads
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file, index) => {
        return new Promise((resolve, reject) => {
          const timestamp = Date.now();
          const filename = `${sanitizedTitle}-${timestamp}-${index}`;

          const stream = cloudinary.uploader.upload_stream(
            {
              folder: folderPath,
              public_id: filename,
              resource_type: "image",
              transformation: [
                { width: 1200, height: 800, crop: "limit" },
                { quality: "auto" },
                { format: "auto" },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else
                resolve({
                  url: result.secure_url,
                  publicId: result.public_id,
                });
            }
          );
          stream.end(file.buffer);
        });
      });

      try {
        uploadedImages = await Promise.all(uploadPromises);
      } catch (uploadError) {
        return next(createError(500, "Failed to upload images"));
      }
    }

    // Create new listing
    const newListing = new Listing({
      title: title.trim(),
      description: description.trim(),
      sellingPrice: type === "sale" ? Number(sellingPrice) : undefined,
      rentalPrice: type === "rent" ? Number(rentalPrice) : undefined,
      discountedPrice: discountedPrice || 0,
      location: location.trim(),
      images: uploadedImages,
      userId,
      type,
      houseSpecifications: parsedHouseSpecs,
    });

    const savedListing = await newListing.save();

    res.status(201).json({
      message: "Listing created successfully",
      listing: savedListing,
    });
  } catch (error) {
    console.error("Create listing error:", error);
    // If it's a validation error from Mongoose
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return next(
        createError(400, `Validation failed: ${messages.join(", ")}`)
      );
    }

    next(createError(500, "Failed to create listing"));
  }
};

export const getListingById = async (req, res, next) => {
  try {
    const { listingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return next(createError(400, "Invalid listing ID"));
    }

    const listing = await Listing.findById(listingId).populate(
      "userId",
      "fullname username avatar"
    );

    if (!listing) {
      return next(createError(404, "Listing not found"));
    }

    const response = {
      ...listing._doc,
      user: listing.userId,
    };

    delete response.userId;

    res.json(response);
  } catch (error) {
    console.error("Get listing error:", error);
    next(createError(500, "Failed to fetch listing"));
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;
    const {
      title,
      description,
      sellingPrice,
      rentalPrice,
      discountedPrice,
      location,
      type,
      houseSpecifications,
    } = req.body;

    // Validate listing ID
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return next(createError(400, "Invalid listing ID"));
    }

    // Find the listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(createError(404, "Listing not found"));
    }

    // Check if user owns the listing
    if (!listing.userId.equals(userId)) {
      return next(createError(403, "You can only update your own listings"));
    }

    // Parse houseSpecifications if it's a string
    let parsedHouseSpecs;
    try {
      parsedHouseSpecs =
        typeof houseSpecifications === "string"
          ? JSON.parse(houseSpecifications)
          : houseSpecifications;
    } catch (error) {
      return next(createError(400, "Invalid house specifications format"));
    }

    // Validate required fields
    if (
      !title?.trim() ||
      !description?.trim() ||
      !location?.trim() ||
      !type ||
      !parsedHouseSpecs
    ) {
      return next(createError(400, "All required fields must be provided"));
    }

    // Validate type enum
    if (!["rent", "sale"].includes(type)) {
      return next(createError(400, "Type must be either 'rent' or 'sale'"));
    }

    // Validate price based on type
    if (type === "sale") {
      if (!sellingPrice || sellingPrice <= 0) {
        return next(
          createError(400, "Valid selling price is required for sale listings")
        );
      }
      if (discountedPrice && discountedPrice >= sellingPrice) {
        return next(
          createError(400, "Discounted price must be less than selling price")
        );
      }
    }

    if (type === "rent") {
      if (!rentalPrice || rentalPrice <= 0) {
        return next(
          createError(400, "Valid rental price is required for rent listings")
        );
      }
    }

    // Handle new image uploads if any
    let newImages = [];
    if (req.files && req.files.length > 0) {
      const sanitizedTitle = title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      const folderPath = `listings/${userId}/${sanitizedTitle}`;

      const uploadPromises = req.files.map((file, index) => {
        return new Promise((resolve, reject) => {
          const timestamp = Date.now();
          const filename = `${sanitizedTitle}-${timestamp}-${index}`;

          const stream = cloudinary.uploader.upload_stream(
            {
              folder: folderPath,
              public_id: filename,
              resource_type: "image",
              transformation: [
                { width: 1200, height: 800, crop: "limit" },
                { quality: "auto" },
                { format: "auto" },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else
                resolve({
                  url: result.secure_url,
                  publicId: result.public_id,
                });
            }
          );
          stream.end(file.buffer);
        });
      });

      try {
        newImages = await Promise.all(uploadPromises);
      } catch (uploadError) {
        return next(createError(500, "Failed to upload new images"));
      }
    }

    // Update listing fields
    listing.title = title.trim();
    listing.description = description.trim();
    listing.location = location.trim();
    listing.type = type;
    listing.houseSpecifications = parsedHouseSpecs;
    listing.sellingPrice = type === "sale" ? Number(sellingPrice) : undefined;
    listing.rentalPrice = type === "rent" ? Number(rentalPrice) : undefined;
    listing.discountedPrice = discountedPrice || 0;

    // Add new images to existing ones
    if (newImages.length > 0) {
      listing.images = [...listing.images, ...newImages];
    }

    const updatedListing = await listing.save();

    res.json({
      message: "Listing updated successfully",
      listing: updatedListing,
    });
  } catch (error) {
    console.error("Update listing error:", error);
    next(createError(500, "Failed to update listing"));
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;

    // Validate listing ID
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return next(createError(400, "Invalid listing ID"));
    }

    // Find the listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(createError(404, "Listing not found"));
    }

    // Check if user owns the listing
    if (!listing.userId.equals(userId)) {
      return next(createError(403, "You can only delete your own listings"));
    }

    // Delete images from Cloudinary
    if (listing.images && listing.images.length > 0) {
      const deletePromises = listing.images.map((image) =>
        cloudinary.uploader.destroy(image.publicId, { invalidate: true })
      );

      try {
        await Promise.all(deletePromises);
      } catch (cloudinaryError) {
        console.error(
          "Error deleting images from Cloudinary:",
          cloudinaryError
        );
        // Continue with listing deletion even if image deletion fails
      }
    }

    // Delete the listing
    await Listing.findByIdAndDelete(listingId);

    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Delete listing error:", error);
    next(createError(500, "Failed to delete listing"));
  }
};
