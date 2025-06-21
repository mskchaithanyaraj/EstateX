import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    sellingPrice: {
      type: Number,
      required: function () {
        return this.type === "sale";
      },
    },
    rentalPrice: {
      type: Number,
      required: function () {
        return this.type === "rent";
      },
    },
    discountedPrice: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      required: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["rent", "sale"],
      required: true,
    },
    houseSpecifications: {
      type: {
        type: String,
        enum: ["apartment", "house", "land", "other"],
        required: true,
      },
      bedrooms: {
        type: Number,
        required: true,
      },
      bathrooms: {
        type: Number,
        required: true,
      },
      area: {
        type: Number, // in square feet
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
