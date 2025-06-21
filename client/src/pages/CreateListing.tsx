import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  Home,
  MapPin,
  Upload,
  X,
  Plus,
  Bed,
  Bath,
  Square,
  IndianRupee,
} from "lucide-react";
import {
  createListingSchema,
  type CreateListingFormData,
} from "../schemas/listing.schemas";
import { listingAPI } from "../services/api";
import { showErrorToast, showSuccessToast } from "../utils/custom-toast";
import type { CreateListingData } from "../types/listing.types";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/user/userSlice";

const CreateListing = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { currentUser } = useSelector(selectCurrentUser);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateListingFormData>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      type: "rent",
      houseSpecifications: {
        type: "apartment",
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
      },
    },
  });

  const watchType = watch("type");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + selectedImages.length > 4) {
      showErrorToast("Too Many Images", "Maximum 4 images allowed");
      return;
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        showErrorToast("File Too Large", `${file.name} is larger than 5MB`);
        return;
      }

      if (!file.type.startsWith("image/")) {
        showErrorToast("Invalid File", `${file.name} is not an image`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setSelectedImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreateListingFormData) => {
    setIsLoading(true);
    try {
      const listingData: CreateListingData = {
        ...data,
        images: selectedImages,
      };

      await listingAPI.createListing(listingData, currentUser?.id || "");
      showSuccessToast(
        "Listing Created!",
        "Your property listing has been created successfully"
      );

      navigate("/listings");
    } catch (error) {
      console.error("Error creating listing:", error);
      const errorMsg =
        error instanceof Error ? error.message : "Failed to create listing";
      showErrorToast("Creation Failed", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-main py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-xtradex text-3xl lg:text-4xl font-bold text-primary mb-2">
            Create New Listing
          </h1>
          <p className="text-muted">Add your property to EstateX marketplace</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-card rounded-2xl shadow-xl border border-default p-6">
                <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                  <Home className="w-5 h-5 mr-2 text-accent" />
                  Basic Information
                </h3>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Property Title *
                    </label>
                    <input
                      {...register("title")}
                      type="text"
                      className="w-full px-4 py-3 bg-input border border-input rounded-xl focus:outline-none focus:border-input-focus focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-primary"
                      placeholder="Beautiful 3BR apartment in downtown..."
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Description *
                    </label>
                    <textarea
                      {...register("description")}
                      rows={4}
                      className="w-full px-4 py-3 bg-input border border-input rounded-xl focus:outline-none focus:border-input-focus focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-primary resize-none"
                      placeholder="Describe your property, amenities, neighborhood..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Location *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                      <input
                        {...register("location")}
                        type="text"
                        className="w-full pl-10 pr-4 py-3 bg-input border border-input rounded-xl focus:outline-none focus:border-input-focus focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-primary"
                        placeholder="123 Main Street, City, State"
                      />
                    </div>
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.location.message}
                      </p>
                    )}
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Listing Type *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="relative">
                        <input
                          {...register("type")}
                          type="radio"
                          value="rent"
                          className="sr-only"
                        />
                        <div
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            watchType === "rent"
                              ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                              : "border-input hover:border-input-focus"
                          }`}
                        >
                          <div className="text-center">
                            <div className="font-medium text-primary">
                              For Rent
                            </div>
                            <div className="text-sm text-muted">
                              Monthly rental
                            </div>
                          </div>
                        </div>
                      </label>
                      <label className="relative">
                        <input
                          {...register("type")}
                          type="radio"
                          value="sale"
                          className="sr-only"
                        />
                        <div
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            watchType === "sale"
                              ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                              : "border-input hover:border-input-focus"
                          }`}
                        >
                          <div className="text-center">
                            <div className="font-medium text-primary">
                              For Sale
                            </div>
                            <div className="text-sm text-muted">
                              One-time purchase
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* House Specifications */}
              <div className="bg-card rounded-2xl shadow-xl border border-default p-6">
                <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                  <Square className="w-5 h-5 mr-2 text-accent" />
                  Property Details
                </h3>

                <div className="space-y-4">
                  {/* Property Type */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Property Type *
                    </label>
                    <select
                      {...register("houseSpecifications.type")}
                      className="w-full px-4 py-3 bg-input border border-input rounded-xl focus:outline-none focus:border-input-focus focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-primary"
                    >
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="land">Land</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Bedrooms, Bathrooms, Area */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        <Bed className="w-4 h-4 inline mr-1" />
                        Bedrooms
                      </label>
                      <input
                        {...register("houseSpecifications.bedrooms", {
                          valueAsNumber: true,
                        })}
                        type="number"
                        min="0"
                        className="w-full px-3 py-2 bg-input border border-input rounded-xl focus:outline-none focus:border-input-focus text-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        <Bath className="w-4 h-4 inline mr-1" />
                        Bathrooms
                      </label>
                      <input
                        {...register("houseSpecifications.bathrooms", {
                          valueAsNumber: true,
                        })}
                        type="number"
                        min="0"
                        step="0.5"
                        className="w-full px-3 py-2 bg-input border border-input rounded-xl focus:outline-none focus:border-input-focus text-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Area (sq ft)
                      </label>
                      <input
                        {...register("houseSpecifications.area", {
                          valueAsNumber: true,
                        })}
                        type="number"
                        min="1"
                        className="w-full px-3 py-2 bg-input border border-input rounded-xl focus:outline-none focus:border-input-focus text-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Pricing */}
              <div className="bg-card rounded-2xl shadow-xl border border-default p-6">
                <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                  <IndianRupee className="w-5 h-5 mr-2 text-accent" />
                  Pricing
                </h3>

                <div className="space-y-4">
                  {watchType === "sale" ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Selling Price * (₹)
                        </label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                          <input
                            {...register("sellingPrice", {
                              valueAsNumber: true,
                              setValueAs: (value) => {
                                const num = parseFloat(value);
                                return isNaN(num) ? undefined : num;
                              },
                            })}
                            type="number"
                            min="1"
                            className="w-full pl-10 pr-4 py-3 bg-input border border-input rounded-xl focus:outline-none focus:border-input-focus focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-primary"
                            placeholder="45,00,000"
                          />
                        </div>
                        {errors.sellingPrice && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.sellingPrice.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Discounted Price (₹)
                        </label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                          <input
                            {...register("discountedPrice", {
                              valueAsNumber: true,
                            })}
                            type="number"
                            min="0"
                            className="w-full pl-10 pr-4 py-3 bg-input border border-input rounded-xl focus:outline-none focus:border-input-focus focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-primary"
                            placeholder="42,50,000"
                          />
                        </div>
                        {errors.discountedPrice && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.discountedPrice.message}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Monthly Rent * (₹)
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                        <input
                          {...register("rentalPrice", {
                            valueAsNumber: true,
                            setValueAs: (value) => {
                              const num = parseFloat(value);
                              return isNaN(num) ? undefined : num;
                            },
                          })}
                          type="number"
                          min="1"
                          className="w-full pl-10 pr-4 py-3 bg-input border border-input rounded-xl focus:outline-none focus:border-input-focus focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-primary"
                          placeholder="25,000"
                        />
                      </div>
                      {errors.rentalPrice && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.rentalPrice.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Images */}
              <div className="bg-card rounded-2xl shadow-xl border border-default p-6">
                <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-accent" />
                  Property Images
                </h3>

                <div className="space-y-4">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-input rounded-xl p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted" />
                      <p className="text-primary mb-1">
                        Click to upload images
                      </p>
                      <p className="text-sm text-muted">
                        Maximum 4 images, 5MB each
                      </p>
                    </label>
                  </div>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Listing...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Create Listing</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
