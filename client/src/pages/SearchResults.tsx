import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  SlidersHorizontal,
  Grid3x3,
  List,
  Heart,
  IndianRupee,
  X,
} from "lucide-react";
import { listingAPI } from "../services/api";
import { showErrorToast } from "../utils/custom-toast";
import LoadingOverlay from "../components/LoadingOverlay";
import type { Listing } from "../types/listing.types";

interface SearchFilters {
  location?: string;
  type?: "rent" | "sale" | "";
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: "apartment" | "house" | "land" | "other" | "";
  minArea?: number;
  maxArea?: number;
  sortBy?: "price-asc" | "price-desc" | "date-desc" | "date-asc" | "";
}

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<SearchFilters>({
    location: searchParams.get("location") || "",
    type: (searchParams.get("type") as "rent" | "sale") || "",
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    bedrooms: searchParams.get("bedrooms")
      ? Number(searchParams.get("bedrooms"))
      : undefined,
    bathrooms: searchParams.get("bathrooms")
      ? Number(searchParams.get("bathrooms"))
      : undefined,
    propertyType:
      (searchParams.get("propertyType") as
        | "apartment"
        | "house"
        | "land"
        | "other") || "",
    minArea: searchParams.get("minArea")
      ? Number(searchParams.get("minArea"))
      : undefined,
    maxArea: searchParams.get("maxArea")
      ? Number(searchParams.get("maxArea"))
      : undefined,
    sortBy:
      (searchParams.get("sortBy") as
        | "price-asc"
        | "price-desc"
        | "date-desc"
        | "date-asc") || "date-desc",
  });

  useEffect(() => {
    const urlLocation = searchParams.get("location");
    const urlType = searchParams.get("type") as "rent" | "sale" | "";

    // Update filters state with URL parameters
    setFilters((prevFilters) => ({
      ...prevFilters,
      location: urlLocation || "",
      type: urlType || "",
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
      bedrooms: searchParams.get("bedrooms")
        ? Number(searchParams.get("bedrooms"))
        : undefined,
      bathrooms: searchParams.get("bathrooms")
        ? Number(searchParams.get("bathrooms"))
        : undefined,
      propertyType:
        (searchParams.get("propertyType") as
          | "apartment"
          | "house"
          | "land"
          | "other") || "",
      minArea: searchParams.get("minArea")
        ? Number(searchParams.get("minArea"))
        : undefined,
      maxArea: searchParams.get("maxArea")
        ? Number(searchParams.get("maxArea"))
        : undefined,
      sortBy:
        (searchParams.get("sortBy") as
          | "price-asc"
          | "price-desc"
          | "date-desc"
          | "date-asc") || "date-desc",
    }));
  }, [searchParams]);

  // Fetch listings when filters change
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        // Create filters object from current filters state
        const searchFilters = {
          ...filters,
          // Ensure location comes from URL params if not in filters
          location: filters.location || searchParams.get("location") || "",
        };

        console.log("Searching with filters:", searchFilters); // Debug log

        const allListings = await listingAPI.searchListings(searchFilters);
        setListings(allListings);
        setFilteredListings(allListings); // Set both since backend handles filtering
      } catch (error) {
        console.error("Error fetching listings:", error);
        showErrorToast("Error", "Failed to fetch search results");
        setListings([]);
        setFilteredListings([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, [filters, searchParams]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...listings];

      // Location filter
      if (filters.location) {
        filtered = filtered.filter((listing) =>
          listing.location
            .toLowerCase()
            .includes(filters.location!.toLowerCase())
        );
      }

      // Type filter
      if (filters.type) {
        filtered = filtered.filter((listing) => listing.type === filters.type);
      }

      // Price filter
      if (filters.minPrice || filters.maxPrice) {
        filtered = filtered.filter((listing) => {
          const price =
            listing.type === "sale"
              ? listing.discountedPrice && listing.discountedPrice > 0
                ? listing.discountedPrice
                : listing.sellingPrice
              : listing.rentalPrice;

          if (!price) return false;

          const minCheck = !filters.minPrice || price >= filters.minPrice;
          const maxCheck = !filters.maxPrice || price <= filters.maxPrice;

          return minCheck && maxCheck;
        });
      }

      // Bedrooms filter
      if (filters.bedrooms !== undefined) {
        filtered = filtered.filter(
          (listing) => listing.houseSpecifications.bedrooms >= filters.bedrooms!
        );
      }

      // Bathrooms filter
      if (filters.bathrooms !== undefined) {
        filtered = filtered.filter(
          (listing) =>
            listing.houseSpecifications.bathrooms >= filters.bathrooms!
        );
      }

      // Property type filter
      if (filters.propertyType) {
        filtered = filtered.filter(
          (listing) => listing.houseSpecifications.type === filters.propertyType
        );
      }

      // Area filter
      if (filters.minArea || filters.maxArea) {
        filtered = filtered.filter((listing) => {
          const area = listing.houseSpecifications.area;
          const minCheck = !filters.minArea || area >= filters.minArea;
          const maxCheck = !filters.maxArea || area <= filters.maxArea;
          return minCheck && maxCheck;
        });
      }

      // Sorting
      if (filters.sortBy) {
        filtered.sort((a, b) => {
          switch (filters.sortBy) {
            case "price-asc": {
              const priceA =
                a.type === "sale"
                  ? a.discountedPrice && a.discountedPrice > 0
                    ? a.discountedPrice
                    : a.sellingPrice
                  : a.rentalPrice;
              const priceB =
                b.type === "sale"
                  ? b.discountedPrice && b.discountedPrice > 0
                    ? b.discountedPrice
                    : b.sellingPrice
                  : b.rentalPrice;
              return (priceA || 0) - (priceB || 0);
            }
            case "price-desc": {
              const priceA =
                a.type === "sale"
                  ? a.discountedPrice && a.discountedPrice > 0
                    ? a.discountedPrice
                    : a.sellingPrice
                  : a.rentalPrice;
              const priceB =
                b.type === "sale"
                  ? b.discountedPrice && b.discountedPrice > 0
                    ? b.discountedPrice
                    : b.sellingPrice
                  : b.rentalPrice;
              return (priceB || 0) - (priceA || 0);
            }
            case "date-desc": {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            }
            case "date-asc": {
              return (
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
              );
            }
            default:
              return 0;
          }
        });
      }

      setFilteredListings(filtered);
    };
    applyFilters();
  }, [listings, filters]);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    // Update URL params
    const newSearchParams = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        newSearchParams.set(key, value.toString());
      }
    });
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      location: "",
      type: "",
      sortBy: "date-desc",
    };
    setFilters(clearedFilters);
    setSearchParams(new URLSearchParams());
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
      <LoadingOverlay isVisible={true} message="Searching properties..." />
    );
  }

  return (
    <div className="min-h-screen bg-main">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 mb-6">
          {/* Title and Results Count */}
          <div>
            <h1 className="text-2xl font-bold text-primary mb-2">
              Search Results
            </h1>
            <p className="text-muted text-sm">
              {filteredListings.length} properties found
              {filters.location && ` in ${filters.location}`}
            </p>
          </div>

          {/* Controls - Mobile Responsive */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Left side controls */}
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="hidden md:flex bg-section rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "grid"
                      ? "bg-accent text-white"
                      : "text-muted hover:text-primary"
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "list"
                      ? "bg-accent text-white"
                      : "text-muted hover:text-primary"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-3 py-2 bg-card border border-default rounded-lg hover:bg-section transition-colors text-sm"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="w-full sm:w-auto">
              <select
                value={filters.sortBy || "date-desc"}
                onChange={(e) =>
                  updateFilters({ sortBy: e.target.value as any })
                }
                className="w-full sm:w-auto px-3 py-2 bg-card border border-default rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Mobile Filter Overlay */}
          {showFilters && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowFilters(false)}
            />
          )}

          <div className="flex gap-6">
            {/* Filters Sidebar */}
            <div
              className={`${
                showFilters
                  ? "fixed top-0 left-0 w-80 h-full bg-main z-50 lg:relative lg:w-80 lg:z-auto"
                  : "hidden lg:block lg:w-80"
              } flex-shrink-0 transition-transform duration-300`}
            >
              <div className="bg-card rounded-2xl border border-default p-6 h-full lg:h-auto lg:sticky lg:top-24 overflow-y-auto">
                {/* Mobile Close Button */}
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h3 className="text-lg font-semibold text-primary">
                    Filters
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-8 h-8 flex items-center justify-center text-muted hover:text-primary transition-colors rounded-lg hover:bg-section"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Desktop Header */}
                <div className="hidden lg:flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary">
                    Filters
                  </h3>
                  <button
                    onClick={clearFilters}
                    className="text-accent hover:text-accent/80 text-sm font-medium"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        type="text"
                        value={filters.location || ""}
                        onChange={(e) =>
                          updateFilters({ location: e.target.value })
                        }
                        placeholder="Enter location..."
                        className="w-full pl-10 pr-4 py-2 bg-section border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary text-sm"
                      />
                    </div>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Listing Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() =>
                          updateFilters({
                            type: filters.type === "rent" ? "" : "rent",
                          })
                        }
                        className={`p-3 rounded-lg border transition-colors text-sm ${
                          filters.type === "rent"
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-default bg-section text-primary hover:bg-input"
                        }`}
                      >
                        For Rent
                      </button>
                      <button
                        onClick={() =>
                          updateFilters({
                            type: filters.type === "sale" ? "" : "sale",
                          })
                        }
                        className={`p-3 rounded-lg border transition-colors text-sm ${
                          filters.type === "sale"
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-default bg-section text-primary hover:bg-input"
                        }`}
                      >
                        For Sale
                      </button>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Price Range (₹)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <IndianRupee className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted" />
                        <input
                          type="number"
                          value={filters.minPrice || ""}
                          onChange={(e) =>
                            updateFilters({
                              minPrice: e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            })
                          }
                          placeholder="Min"
                          className="w-full pl-6 pr-2 py-2 bg-section border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary text-sm"
                        />
                      </div>
                      <div className="relative">
                        <IndianRupee className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted" />
                        <input
                          type="number"
                          value={filters.maxPrice || ""}
                          onChange={(e) =>
                            updateFilters({
                              maxPrice: e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            })
                          }
                          placeholder="Max"
                          className="w-full pl-6 pr-2 py-2 bg-section border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Bedrooms
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((bed) => (
                        <button
                          key={bed}
                          onClick={() =>
                            updateFilters({
                              bedrooms:
                                filters.bedrooms === bed ? undefined : bed,
                            })
                          }
                          className={`p-2 rounded-lg border transition-colors text-sm ${
                            filters.bedrooms === bed
                              ? "border-accent bg-accent/10 text-accent"
                              : "border-default bg-section text-primary hover:bg-input"
                          }`}
                        >
                          {bed}+
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bathrooms */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Bathrooms
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((bath) => (
                        <button
                          key={bath}
                          onClick={() =>
                            updateFilters({
                              bathrooms:
                                filters.bathrooms === bath ? undefined : bath,
                            })
                          }
                          className={`p-2 rounded-lg border transition-colors text-sm ${
                            filters.bathrooms === bath
                              ? "border-accent bg-accent/10 text-accent"
                              : "border-default bg-section text-primary hover:bg-input"
                          }`}
                        >
                          {bath}+
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Property Type */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Property Type
                    </label>
                    <select
                      value={filters.propertyType || ""}
                      onChange={(e) =>
                        updateFilters({ propertyType: e.target.value as any })
                      }
                      className="w-full px-3 py-2 bg-section border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary text-sm"
                    >
                      <option value="">All Types</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="land">Land</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Area Range */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Area Range (sq ft)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={filters.minArea || ""}
                        onChange={(e) =>
                          updateFilters({
                            minArea: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          })
                        }
                        placeholder="Min area"
                        className="w-full px-3 py-2 bg-section border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary text-sm"
                      />
                      <input
                        type="number"
                        value={filters.maxArea || ""}
                        onChange={(e) =>
                          updateFilters({
                            maxArea: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          })
                        }
                        placeholder="Max area"
                        className="w-full px-3 py-2 bg-section border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary text-sm"
                      />
                    </div>
                  </div>

                  {/* Mobile Clear Filters Button */}
                  <div className="lg:hidden pt-4 border-t border-default">
                    <button
                      onClick={() => {
                        clearFilters();
                        setShowFilters(false);
                      }}
                      className="w-full btn-secondary py-3 rounded-xl text-sm"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 min-w-0">
              {filteredListings.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-card rounded-2xl border border-default p-8 sm:p-12 max-w-md mx-auto">
                    <Search className="w-16 h-16 text-muted mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      No properties found
                    </h3>
                    <p className="text-muted mb-6 text-sm">
                      Try adjusting your filters or search criteria
                    </p>
                    <button
                      onClick={clearFilters}
                      className="btn-primary px-6 py-3 rounded-xl text-sm"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredListings.map((listing) => (
                    <div
                      key={listing._id}
                      className={`bg-card rounded-2xl border border-default overflow-hidden hover:shadow-xl transition-all duration-300 group ${
                        viewMode === "list" ? "flex flex-col sm:flex-row" : ""
                      }`}
                    >
                      {/* Image */}
                      <div
                        className={`relative overflow-hidden ${
                          viewMode === "list"
                            ? " sm:w-64 h-48 md:h-73 flex-shrink-0"
                            : "h-48"
                        }`}
                      >
                        {listing.images && listing.images.length > 0 ? (
                          <img
                            src={listing.images[0].url}
                            alt={listing.title}
                            className={`w-full  h-full object-cover group-hover:scale-105 transition-transform duration-300`}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 flex items-center justify-center">
                            <Square className="w-12 h-12 text-orange-400" />
                          </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              listing.type === "sale"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400"
                            }`}
                          >
                            For {listing.type === "sale" ? "Sale" : "Rent"}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute top-3 right-3 flex space-x-2">
                          <button className="w-8 h-8 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors">
                            <Heart className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-6 flex-1">
                        {/* Title */}
                        <Link to={`/listings/${listing._id}`} className="block">
                          <h3 className="font-semibold text-lg text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                            {listing.title}
                          </h3>
                        </Link>

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
                              <div className="text-xl sm:text-2xl font-bold text-primary">
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
                            <div className="text-xl sm:text-2xl font-bold text-primary">
                              {formatPrice(listing.rentalPrice || 0)}
                              <span className="text-sm font-normal text-muted">
                                /month
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Specifications */}
                        <div className="flex items-center justify-between text-sm text-muted mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center">
                              <Bed className="w-4 h-4 mr-1" />
                              <span>
                                {listing.houseSpecifications.bedrooms}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Bath className="w-4 h-4 mr-1" />
                              <span>
                                {listing.houseSpecifications.bathrooms}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Square className="w-4 h-4 mr-1" />
                              <span className="hidden sm:inline">
                                {listing.houseSpecifications.area} sq ft
                              </span>
                              <span className="sm:hidden">
                                {listing.houseSpecifications.area}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Date */}
                        <div className="flex items-center text-xs text-muted mb-4">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>Listed on {formatDate(listing.createdAt)}</span>
                        </div>

                        {/* Action Button */}
                        <Link
                          to={`/listings/${listing._id}`}
                          className={`
    w-full bg-accent hover:bg-accent/90 
    text-white dark:text-white 
    text-center py-2 sm:py-3 px-4 
    rounded-xl transition-colors 
    font-medium inline-block text-sm
    ${viewMode === "list" ? "mt-2" : ""}
  `}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
