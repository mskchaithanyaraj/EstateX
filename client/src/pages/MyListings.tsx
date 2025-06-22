import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  MoreVertical,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/user/userSlice";
import { listingAPI } from "../services/api";
import { showErrorToast, showSuccessToast } from "../utils/custom-toast";
import LoadingOverlay from "../components/LoadingOverlay";
import WarningPopup from "../components/WarningPopup";
import type { Listing } from "../types/listing.types";

const MyListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const { currentUser } = useSelector(selectCurrentUser);

  useEffect(() => {
    const fetchListings = async () => {
      if (!currentUser?.id) return;

      setIsLoading(true);
      try {
        const userListings = await listingAPI.getListings(currentUser.id);
        setListings(userListings);
      } catch (error) {
        console.error("Error fetching listings:", error);
        showErrorToast("Error", "Failed to fetch your listings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, [currentUser?.id]);

  const handleDeleteListing = async () => {
    if (!listingToDelete) return;

    setDeleteLoading(true);
    try {
      await listingAPI.deleteListing(listingToDelete);
      setListings(
        listings.filter((listing) => listing._id !== listingToDelete)
      );
      showSuccessToast("Deleted!", "Listing deleted successfully");
      setShowDeleteWarning(false);
      setListingToDelete(null);
    } catch (error) {
      console.error("Error deleting listing:", error);
      showErrorToast("Error", "Failed to delete listing");
    } finally {
      setDeleteLoading(false);
    }
  };

  const confirmDelete = (listingId: string) => {
    setListingToDelete(listingId);
    setShowDeleteWarning(true);
    setActiveDropdown(null);
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
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <LoadingOverlay isVisible={true} message="Loading your listings..." />
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

      <div className="min-h-screen bg-main py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="font-xtradex text-3xl lg:text-4xl font-bold text-primary mb-2">
                My Listings
              </h1>
              <p className="text-muted">
                Manage your property listings ({listings.length} total)
              </p>
            </div>
            <Link
              to="/create-listing"
              className="btn-primary px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Listing</span>
            </Link>
          </div>

          {/* Listings Grid */}
          {listings.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-card rounded-2xl shadow-xl border border-default p-12 max-w-md mx-auto">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  No listings yet
                </h3>
                <p className="text-muted mb-6">
                  Create your first property listing to get started
                </p>
                <Link
                  to="/create-listing"
                  className="btn-primary px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg inline-flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Listing</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div
                  key={listing._id}
                  className="bg-card rounded-2xl shadow-xl border border-default overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0].url}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 flex items-center justify-center">
                        <Square className="w-12 h-12 text-orange-400" />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          listing.type === "sale"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                        }`}
                      >
                        For {listing.type === "sale" ? "Sale" : "Rent"}
                      </span>
                    </div>

                    {/* Actions Dropdown */}
                    <div className="absolute top-3 right-3">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === listing._id
                                ? null
                                : listing._id
                            )
                          }
                          className="w-8 h-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>

                        {activeDropdown === listing._id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActiveDropdown(null)}
                            />
                            <div className="absolute right-0 top-9 w-40 bg-card border border-default rounded-lg shadow-lg z-20 overflow-hidden">
                              <Link
                                to={`/listings/${listing._id}`}
                                className="flex items-center space-x-2 px-3 py-2 text-sm text-primary hover:bg-section transition-colors"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <Eye className="w-4 h-4" />
                                <span>View</span>
                              </Link>
                              <Link
                                to={`/listings/${listing._id}/edit`}
                                className="flex items-center space-x-2 px-3 py-2 text-sm text-primary hover:bg-section transition-colors"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                              </Link>
                              <button
                                onClick={() => confirmDelete(listing._id)}
                                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Title */}
                    <h3 className="font-semibold text-lg text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                      {listing.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center text-muted mb-3">
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="text-sm truncate">
                        {listing.location}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      {listing.type === "sale" ? (
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            {formatPrice(
                              listing.discountedPrice &&
                                listing.discountedPrice > 0
                                ? listing.discountedPrice
                                : listing.sellingPrice || 0
                            )}
                          </div>
                          {listing.discountedPrice &&
                            listing.discountedPrice > 0 && (
                              <div className="text-sm text-muted line-through">
                                {formatPrice(listing.sellingPrice || 0)}
                              </div>
                            )}
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(listing.rentalPrice || 0)}
                          <span className="text-sm font-normal text-muted">
                            /month
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Specifications */}
                    <div className="flex items-center justify-between text-sm text-muted mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          <span>{listing.houseSpecifications.bedrooms}</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="w-4 h-4 mr-1" />
                          <span>{listing.houseSpecifications.bathrooms}</span>
                        </div>
                        <div className="flex items-center">
                          <Square className="w-4 h-4 mr-1" />
                          <span>{listing.houseSpecifications.area} sq ft</span>
                        </div>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center text-xs text-muted mb-4">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>Listed on {formatDate(listing.createdAt)}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Link
                        to={`/listings/${listing._id}`}
                        className="flex-1 bg-section hover:bg-input border border-default text-primary text-center py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/listings/${listing._id}/edit`}
                        className="bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/20 dark:hover:bg-orange-800/30 text-orange-600 dark:text-orange-400 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyListings;
