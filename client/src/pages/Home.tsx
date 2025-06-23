import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Heart,
  SlidersHorizontal,
  Grid3x3,
  List,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { listingAPI } from "../services/api";
import { showErrorToast } from "../utils/custom-toast";
import LoadingOverlay from "../components/LoadingOverlay";
import type { Listing } from "../types/listing.types";

const Home = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<
    "date-desc" | "date-asc" | "price-asc" | "price-desc"
  >("date-desc");

  useEffect(() => {
    const fetchAllListings = async () => {
      setIsLoading(true);
      try {
        // Fetch all listings with just sorting
        const allListings = await listingAPI.searchListings({ sortBy });
        setListings(allListings);
      } catch (error) {
        console.error("Error fetching listings:", error);
        showErrorToast("Error", "Failed to fetch listings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllListings();
  }, [sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?location=${encodeURIComponent(searchQuery.trim())}`);
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
      month: "short",
      day: "numeric",
    });
  };

  const getListingPrice = (listing: Listing): number => {
    if (listing.type === "sale") {
      return listing.discountedPrice && listing.discountedPrice > 0
        ? listing.discountedPrice
        : listing.sellingPrice || 0;
    }
    return listing.rentalPrice || 0;
  };

  const featuredListings = listings.slice(0, 6);
  const quickStats = {
    totalListings: listings.length,
    forSale: listings.filter((l) => l.type === "sale").length,
    forRent: listings.filter((l) => l.type === "rent").length,
    avgPrice:
      listings.length > 0
        ? listings.reduce((acc, listing) => acc + getListingPrice(listing), 0) /
          listings.length
        : 0,
  };

  if (isLoading) {
    return <LoadingOverlay isVisible={true} message="Loading properties..." />;
  }

  return (
    <div className="min-h-screen bg-main">
      {/* Hero Section with Search */}
      <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-extrabold font-xtradex text-4xl md:text-6xl mb-6">
              <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                Discover
              </span>
              <span className="text-primary ml-4">Properties</span>
            </h1>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Find your perfect home from our extensive collection of premium
              properties
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <form
              onSubmit={handleSearch}
              className="relative group search-enhanced"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
              <div className="relative bg-card rounded-2xl shadow-2xl border border-default">
                <div className="flex items-center p-2">
                  <Search className="w-6 h-6 text-muted ml-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by location, property type, or area..."
                    className="flex-1 px-4 py-4 bg-transparent text-primary placeholder-muted focus:outline-none text-lg border-none"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link
              to="/search?type=rent"
              className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-800/30 text-blue-700 dark:text-blue-400 px-6 py-3 rounded-xl transition-colors font-medium"
            >
              For Rent
            </Link>
            <Link
              to="/search?type=sale"
              className="bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-800/30 text-green-700 dark:text-green-400 px-6 py-3 rounded-xl transition-colors font-medium"
            >
              For Sale
            </Link>
            <Link
              to="/search"
              className="bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-800/30 text-purple-700 dark:text-purple-400 px-6 py-3 rounded-xl transition-colors font-medium flex items-center space-x-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Advanced Search</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Section */}
        <section className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 text-center border border-blue-200 dark:border-blue-800">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {quickStats.totalListings}
              </div>
              <div className="text-blue-700 dark:text-blue-300 text-sm md:text-base">
                Total Properties
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 text-center border border-green-200 dark:border-green-800">
              <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {quickStats.forSale}
              </div>
              <div className="text-green-700 dark:text-green-300 text-sm md:text-base">
                For Sale
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 text-center border border-purple-200 dark:border-purple-800">
              <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {quickStats.forRent}
              </div>
              <div className="text-purple-700 dark:text-purple-300 text-sm md:text-base">
                For Rent
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 text-center border border-orange-200 dark:border-orange-800">
              <div className="text-lg md:text-xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                {quickStats.avgPrice > 0
                  ? formatPrice(quickStats.avgPrice)
                  : "₹0"}
              </div>
              <div className="text-orange-700 dark:text-orange-300 text-sm md:text-base">
                Avg Price
              </div>
            </div>
          </div>
        </section>

        {/* Featured Properties Section */}
        {featuredListings.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-primary mb-2">
                  Featured Properties
                </h2>
                <p className="text-muted">
                  Handpicked premium listings just for you
                </p>
              </div>
              <Link
                to="/search"
                className="text-accent hover:text-accent/80 font-medium flex items-center space-x-2 group"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((listing) => (
                <div
                  key={listing._id}
                  className="bg-card rounded-2xl border border-default overflow-hidden hover:shadow-xl transition-all duration-300 group"
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

                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          listing.type === "sale"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400"
                        }`}
                      >
                        {listing.type === "sale" ? "For Sale" : "For Rent"}
                      </span>
                    </div>

                    {/* Heart Button */}
                    <div className="absolute top-3 right-3">
                      <button className="w-8 h-8 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors">
                        <Heart className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <Link to={`/listings/${listing._id}`} className="block">
                      <h3 className="font-semibold text-lg text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                        {listing.title}
                      </h3>
                    </Link>

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
                            {formatPrice(getListingPrice(listing))}
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

                    {/* Specs */}
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
                          <span>{listing.houseSpecifications.area}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/listings/${listing._id}`}
                      className="w-full bg-accent hover:bg-accent/90 text-white text-center py-3 px-4 rounded-xl transition-colors font-medium inline-block"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Properties Section */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">
                All Properties
              </h2>
              <p className="text-muted">
                {listings.length} properties available
              </p>
            </div>

            <div className="flex items-center space-x-4">
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

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSortBy(
                    e.target.value as
                      | "date-desc"
                      | "date-asc"
                      | "price-asc"
                      | "price-desc"
                  )
                }
                className="px-4 py-2 bg-card border border-default rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-card rounded-2xl border border-default p-12 max-w-md mx-auto">
                <Search className="w-16 h-16 text-muted mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">
                  No properties found
                </h3>
                <p className="text-muted mb-6">
                  Be the first to list a property on EstateX
                </p>
                <Link
                  to="/create-listing"
                  className="btn-primary px-6 py-3 rounded-xl inline-flex items-center space-x-2"
                >
                  <span>Create Listing</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {listings.map((listing) => (
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
                        ? "h-48 sm:w-64 sm:h-48 flex-shrink-0"
                        : "h-48"
                    }`}
                  >
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

                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          listing.type === "sale"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400"
                        }`}
                      >
                        {listing.type === "sale" ? "Sale" : "Rent"}
                      </span>
                    </div>

                    {/* Heart Button */}
                    <div className="absolute top-3 right-3">
                      <button className="w-8 h-8 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors">
                        <Heart className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6 flex-1">
                    <Link to={`/listings/${listing._id}`} className="block">
                      <h3 className="font-semibold text-lg text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                        {listing.title}
                      </h3>
                    </Link>

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
                            {formatPrice(getListingPrice(listing))}
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

                    {/* Specs */}
                    <div className="flex items-center justify-between text-sm text-muted mb-4">
                      <div className="flex items-center space-x-3">
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

                    <Link
                      to={`/listings/${listing._id}`}
                      className="w-full bg-accent hover:bg-accent/90 text-white text-center py-2 sm:py-3 px-4 rounded-xl transition-colors font-medium inline-block text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
