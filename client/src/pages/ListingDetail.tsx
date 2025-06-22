import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Edit,
  Trash2,
  Share2,
  Heart,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/user/userSlice";
import { listingAPI } from "../services/api";
import { showErrorToast, showSuccessToast } from "../utils/custom-toast";
import LoadingOverlay from "../components/LoadingOverlay";
import WarningPopup from "../components/WarningPopup";
import type { Listing } from "../types/listing.types";

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useSelector(selectCurrentUser);

  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      const fetchListing = async () => {
        if (!id) return;

        setIsLoading(true);
        try {
          const listingData = await listingAPI.getListingById(id);
          setListing(listingData);
        } catch (error) {
          console.error("Error fetching listing:", error);
          showErrorToast("Error", "Failed to load listing");
          navigate("/my-listings");
        } finally {
          setIsLoading(false);
        }
      };
      fetchListing();
    }
  }, [id, navigate]);

  const handleDeleteListing = async () => {
    if (!listing) return;

    setDeleteLoading(true);
    try {
      await listingAPI.deleteListing(listing._id);
      showSuccessToast("Deleted!", "Listing deleted successfully");
      navigate("/my-listings");
    } catch (error) {
      console.error("Error deleting listing:", error);
      showErrorToast("Error", "Failed to delete listing");
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const nextImage = () => {
    if (listing && listing.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === listing.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const previousImage = () => {
    if (listing && listing.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? listing.images.length - 1 : prev - 1
      );
    }
  };

  const isOwner = currentUser?.id === listing?.user._id;

  if (isLoading) {
    return (
      <LoadingOverlay isVisible={true} message="Loading listing details..." />
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-main flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Listing not found
          </h2>
          <Link to="/my-listings" className="btn-primary px-6 py-3 rounded-xl">
            Back to My Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <LoadingOverlay
        isVisible={deleteLoading}
        message="Deleting listing..."
        submessage="Please wait while we remove your listing"
      />

      <WarningPopup
        isOpen={showDeleteWarning}
        onClose={() => setShowDeleteWarning(false)}
        onConfirm={handleDeleteListing}
        title="Delete Listing"
        message="Are you sure you want to delete this listing? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      <div className="min-h-screen bg-main">
        {/* Header */}
        <div className="bg-card border-b border-default sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-primary hover:text-accent transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>

              {isOwner && (
                <div className="flex items-center space-x-3">
                  <Link
                    to={`/listings/${listing._id}/edit`}
                    className="btn-secondary px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => setShowDeleteWarning(true)}
                    className="bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-800/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images and Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              {listing.images && listing.images.length > 0 && (
                <div className="bg-card rounded-2xl overflow-hidden shadow-xl border border-default">
                  <div className="relative h-96 lg:h-[500px]">
                    <img
                      src={listing.images[currentImageIndex].url}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />

                    {listing.images.length > 1 && (
                      <>
                        <button
                          onClick={previousImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
                      {currentImageIndex + 1} / {listing.images.length}
                    </div>
                  </div>

                  {/* Thumbnail Navigation */}
                  {listing.images.length > 1 && (
                    <div className="p-4 bg-section">
                      <div className="flex space-x-2 overflow-x-auto">
                        {listing.images.map((image, index) => (
                          <button
                            key={image.publicId}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                              index === currentImageIndex
                                ? "border-orange-500"
                                : "border-transparent hover:border-gray-300"
                            }`}
                          >
                            <img
                              src={image.url}
                              alt={`${listing.title} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Property Details */}
              <div className="bg-card rounded-2xl shadow-xl border border-default p-6">
                <div className="space-y-6">
                  {/* Title and Status */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h1 className="text-3xl font-bold text-primary">
                        {listing.title}
                      </h1>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          listing.type === "sale"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                        }`}
                      >
                        For {listing.type === "sale" ? "Sale" : "Rent"}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-muted">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{listing.location}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="border-t border-default pt-6">
                    <h3 className="text-lg font-semibold text-primary mb-2">
                      Price
                    </h3>
                    {listing.type === "sale" ? (
                      <div>
                        <div className="text-3xl font-bold text-primary">
                          {formatPrice(
                            listing.discountedPrice &&
                              listing.discountedPrice > 0
                              ? listing.discountedPrice
                              : listing.sellingPrice || 0
                          )}
                        </div>
                        {listing.discountedPrice &&
                          listing.discountedPrice > 0 && (
                            <div className="text-lg text-muted line-through">
                              {formatPrice(listing.sellingPrice || 0)}
                            </div>
                          )}
                      </div>
                    ) : (
                      <div className="text-3xl font-bold text-primary">
                        {formatPrice(listing.rentalPrice || 0)}
                        <span className="text-lg font-normal text-muted">
                          /month
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Specifications */}
                  <div className="border-t border-default pt-6">
                    <h3 className="text-lg font-semibold text-primary mb-4">
                      Property Details
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-section rounded-xl">
                        <Bed className="w-6 h-6 text-accent mx-auto mb-2" />
                        <div className="text-lg font-semibold text-primary">
                          {listing.houseSpecifications.bedrooms}
                        </div>
                        <div className="text-sm text-muted">Bedrooms</div>
                      </div>
                      <div className="text-center p-4 bg-section rounded-xl">
                        <Bath className="w-6 h-6 text-accent mx-auto mb-2" />
                        <div className="text-lg font-semibold text-primary">
                          {listing.houseSpecifications.bathrooms}
                        </div>
                        <div className="text-sm text-muted">Bathrooms</div>
                      </div>
                      <div className="text-center p-4 bg-section rounded-xl">
                        <Square className="w-6 h-6 text-accent mx-auto mb-2" />
                        <div className="text-lg font-semibold text-primary">
                          {listing.houseSpecifications.area}
                        </div>
                        <div className="text-sm text-muted">Sq Ft</div>
                      </div>
                      <div className="text-center p-4 bg-section rounded-xl">
                        <div className="w-6 h-6 text-accent mx-auto mb-2 text-center text-xs font-bold border border-accent rounded flex items-center justify-center">
                          {listing.houseSpecifications.type
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div className="text-lg font-semibold text-primary capitalize">
                          {listing.houseSpecifications.type}
                        </div>
                        <div className="text-sm text-muted">Type</div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="border-t border-default pt-6">
                    <h3 className="text-lg font-semibold text-primary mb-4">
                      Description
                    </h3>
                    <p className="text-muted leading-relaxed whitespace-pre-line">
                      {listing.description}
                    </p>
                  </div>

                  {/* Listing Date */}
                  <div className="border-t border-default pt-6">
                    <div className="flex items-center text-muted">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span>Listed on {formatDate(listing.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Owner Info and Actions */}
            <div className="space-y-6">
              {/* Owner Information */}
              <div className="bg-card rounded-2xl shadow-xl border border-default p-6">
                <h3 className="text-lg font-semibold text-primary mb-4">
                  Listed By
                </h3>
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={
                      listing.user.avatar?.url ||
                      `https://ui-avatars.com/api/?name=${listing.user.fullname}&background=f97316&color=fff`
                    }
                    alt={listing.user.fullname}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-primary">
                      {listing.user.fullname}
                    </div>
                    <div className="text-sm text-muted">
                      @{listing.user.username}
                    </div>
                  </div>
                </div>

                {!isOwner && (
                  <div className="space-y-3">
                    <button className="w-full btn-primary py-3 rounded-xl flex items-center justify-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>Call Owner</span>
                    </button>
                    <button className="w-full btn-secondary py-3 rounded-xl flex items-center justify-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Send Message</span>
                    </button>
                  </div>
                )}
              </div>
              {/*  TODO : ADD QUICK ACTIONS FUNCTIONALITY */}
              {/* Quick Actions */}
              <div className="bg-card rounded-2xl shadow-xl border border-default p-6">
                <h3 className="text-lg font-semibold text-primary mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full btn-secondary py-3 rounded-xl flex items-center justify-center space-x-2">
                    <Share2 className="w-4 h-4" />
                    <span>Share Listing</span>
                  </button>
                  <button className="w-full btn-secondary py-3 rounded-xl flex items-center justify-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>Save to Favorites</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingDetail;
