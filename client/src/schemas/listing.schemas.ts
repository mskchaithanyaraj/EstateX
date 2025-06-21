import { z } from "zod";

export const houseSpecificationsSchema = z.object({
  type: z.enum(["apartment", "house", "land", "other"], {
    required_error: "Property type is required",
  }),
  bedrooms: z
    .number()
    .min(0, "Bedrooms must be 0 or more")
    .max(20, "Maximum 20 bedrooms allowed"),
  bathrooms: z
    .number()
    .min(0, "Bathrooms must be 0 or more")
    .max(10, "Maximum 10 bathrooms allowed"),
  area: z
    .number()
    .min(1, "Area must be greater than 0")
    .max(1000000, "Area seems too large"),
});

export const createListingSchema = z
  .object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title must be less than 100 characters"),
    description: z
      .string()
      .min(20, "Description must be at least 20 characters")
      .max(1000, "Description must be less than 1000 characters"),
    location: z
      .string()
      .min(5, "Location must be at least 5 characters")
      .max(200, "Location must be less than 200 characters"),
    type: z.enum(["rent", "sale"], {
      required_error: "Listing type is required",
    }),
    sellingPrice: z
      .number()
      .positive("Selling price must be positive")
      .optional(),
    rentalPrice: z
      .number()
      .positive("Rental price must be positive")
      .optional(),
    discountedPrice: z
      .number()
      .min(0, "Discounted price cannot be negative")
      .optional(),
    houseSpecifications: houseSpecificationsSchema,
  })
  .refine(
    (data) => {
      if (data.type === "sale") {
        return data.sellingPrice && data.sellingPrice > 0;
      }
      return true;
    },
    {
      message: "Selling price is required for sale listings",
      path: ["sellingPrice"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "rent") {
        return data.rentalPrice && data.rentalPrice > 0;
      }
      return true;
    },
    {
      message: "Rental price is required for rent listings",
      path: ["rentalPrice"],
    }
  )
  .refine(
    (data) => {
      if (data.discountedPrice && data.sellingPrice) {
        return data.discountedPrice < data.sellingPrice;
      }
      return true;
    },
    {
      message: "Discounted price must be less than selling price",
      path: ["discountedPrice"],
    }
  );

export type CreateListingFormData = z.infer<typeof createListingSchema>;
