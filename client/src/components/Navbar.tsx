import { Link, useNavigate } from "react-router-dom";
import ThemeToggler from "./ThemeToggler";
import { Search, Menu, X, Plus, Home } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser, signOut } from "../redux/user/userSlice";
import { User, LogOut, Settings } from "lucide-react";
import { useDispatch } from "react-redux";
import { authAPI } from "../services/api";
import { blankProfileImage } from "../utils/cutom-icons";
import { showErrorToast, showSuccessToast } from "../utils/custom-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useSelector(selectCurrentUser);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      // Call API to clear server-side cookie
      await authAPI.signOut();

      showSuccessToast(
        "Signed Out Successfully",
        "You have been securely signed out"
      );
    } catch (error) {
      console.error("Sign out error:", error);
      showErrorToast(
        "Sign Out Error",
        "There was an issue signing out, but you've been logged out locally"
      );
    } finally {
      // Always clear Redux state regardless of API result
      dispatch(signOut());
      setIsProfileDropdownOpen(false);
      navigate("/overview", { replace: true });
    }
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery) {
      // Navigate to search page with location parameter
      navigate(`/search?location=${encodeURIComponent(trimmedQuery)}`);

      // Close mobile menu if open
      setIsMenuOpen(false);

      setSearchQuery("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-nav backdrop-blur-md border-b border-default shadow-lg">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-22">
          {/* Logo */}
          <Link
            to={currentUser ? "/" : "/overview"}
            className="flex items-center space-x-3 group"
          >
            <div
              className="font-extrabold text-5xl flex items-center"
              style={{ fontFamily: "Xtradex" }}
            >
              <span className="bg-gradient-to-r from-gray-900 via-gray-600 to-gray-800 dark:from-gray-100 dark:via-gray-300 dark:to-gray-200 bg-clip-text text-transparent p-1">
                Estate
              </span>
              <span className="ml-1 text-amber-600 dark:text-amber-400 group-hover:text-amber-500 transition-colors duration-300">
                X
              </span>
            </div>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form className="w-full" onSubmit={handleSearch}>
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search properties by location..."
                  className="w-full bg-input text-primary 
                           border border-input rounded-full py-2 pl-4 pr-10 
                           focus:outline-none focus:border-input-focus focus:ring-2 focus:ring-orange-500/20
                           transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 
                           text-muted hover:text-accent 
                           transition-colors duration-200"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <ul className="flex items-center space-x-6">
              {[
                ...(currentUser
                  ? [{ to: "/", label: "Home" }]
                  : [{ to: "/overview", label: "Overview" }]),

                ...(currentUser
                  ? [{ to: "/my-listings", label: "My Listings" }]
                  : []),
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-primary hover:text-accent 
                             transition-colors duration-200 font-medium relative group"
                  >
                    {label}
                    <span
                      className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent
                                   transition-all duration-300 group-hover:w-full"
                    ></span>
                  </Link>
                </li>
              ))}
            </ul>

            {currentUser && (
              <Link
                to="/create-listing"
                className="btn-primary px-4 py-2 rounded-full font-medium 
                 transition-all duration-300 hover:shadow-lg hover:scale-105
                 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>List Property</span>
              </Link>
            )}

            {/* Auth/Profile Section */}
            {currentUser ? (
              // Profile Section (when user is signed in)
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="flex items-center space-x-2 bg-section hover:bg-input
                 text-primary border border-default  cursor-pointer
                 hover:border-input-focus rounded-full px-3 py-2 
                 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  >
                    <img
                      src={currentUser.avatar?.url || blankProfileImage}
                      alt={currentUser.username}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium truncate max-w-24">
                      {currentUser.username}
                    </span>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      />
                      <div
                        className="absolute right-0 mt-2 w-48 bg-card border border-default 
                        rounded-xl shadow-lg z-20 overflow-hidden backdrop-blur-md"
                      >
                        <div className="px-4 py-3 border-b border-default">
                          <p className="text-sm font-medium text-primary truncate">
                            {currentUser.fullname || currentUser.username}
                          </p>
                          <p className="text-xs text-muted truncate">
                            {currentUser.email}
                          </p>
                        </div>
                        <div className="py-2">
                          <Link
                            to="/profile"
                            className="flex items-center space-x-3 px-4 py-2 text-primary hover:bg-section
                         transition-colors duration-200 group"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <User
                              size={16}
                              className="text-muted group-hover:text-accent"
                            />
                            <span>Profile</span>
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center space-x-3 px-4 py-2 text-primary hover:bg-section
                         transition-colors duration-200 group"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <Settings
                              size={16}
                              className="text-muted group-hover:text-accent"
                            />
                            <span>Settings</span>
                          </Link>
                          <hr className="border-default my-2" />
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20
                         transition-colors duration-200 group cursor-pointer"
                          >
                            <LogOut
                              size={16}
                              className="group-hover:scale-110 transition-transform duration-200"
                            />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              // Auth Buttons (when user is not signed in)
              <div className="flex items-center space-x-3">
                <Link
                  to="/sign-in"
                  className="text-primary hover:text-accent 
               transition-colors duration-200 font-medium px-3 py-1.5 cursor-pointer"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="btn-primary px-4 py-1.5 rounded-full font-medium 
               transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Theme Toggler */}
            <ThemeToggler />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggler />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary hover:text-accent 
                       p-2 transition-colors duration-200 relative"
            >
              {/* Animated Hamburger/Cross Icon */}
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${
                    isMenuOpen ? "rotate-45 translate-y-0.5" : "translate-y-0"
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out my-1 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${
                    isMenuOpen ? "-rotate-45 -translate-y-0.5" : "translate-y-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Only show when menu is closed */}
        {!isMenuOpen && (
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search properties by location..."
                  className="w-full bg-input text-primary 
                           border border-input rounded-full py-2 pl-4 pr-10 
                           focus:outline-none focus:border-input-focus focus:ring-2 focus:ring-orange-500/20
                           transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 
                           text-muted hover:text-accent 
                           transition-colors duration-200"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Modern Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 z-50 h-[calc(100vh-4rem)]">
          {/* Backdrop with fade-in animation */}
          <div
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ease-in-out ${
              isMenuOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Panel with slide-in animation */}
          <div
            className={`relative bg-white dark:bg-gray-900 h-full overflow-y-auto shadow-2xl
                       transform transition-transform duration-300 ease-in-out ${
                         isMenuOpen ? "translate-x-0" : "translate-x-full"
                       }`}
          >
            <div className="p-6 space-y-4">
              {/* Profile Section (if signed in) */}
              {currentUser && (
                <div
                  className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl
                             transform transition-all duration-500 delay-100 ease-out
                             animate-fadeInUp"
                >
                  <img
                    src={currentUser.avatar?.url || blankProfileImage}
                    alt={currentUser.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 dark:text-white font-semibold text-base truncate">
                      {currentUser.fullname || currentUser.username}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Links with staggered animation */}
              <div className="space-y-2">
                {[
                  ...(currentUser
                    ? [{ to: "/", label: "Home", icon: Home }]
                    : [{ to: "/overview", label: "Overview", icon: Home }]),
                  ...(currentUser
                    ? [{ to: "/my-listings", label: "My Listings", icon: User }]
                    : []),
                ].map(({ to, label, icon: Icon }, index) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-4 p-4 
                               text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400
                               hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl
                               transition-all duration-200 transform hover:scale-105
                               animate-slideInFromRight`}
                    style={{
                      animationDelay: `${(index + 1) * 100}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{label}</span>
                  </Link>
                ))}

                {/* Create Listing Button with special animation */}
                {currentUser && (
                  <Link
                    to="/create-listing"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 p-4 mt-4
                               bg-orange-600 hover:bg-orange-700 text-white
                               rounded-xl font-semibold
                               transition-all duration-200 transform hover:scale-105 hover:shadow-lg
                               animate-bounceIn"
                    style={{
                      animationDelay: "400ms",
                      animationFillMode: "both",
                    }}
                  >
                    <Plus size={20} />
                    <span>List Property</span>
                  </Link>
                )}
              </div>

              {/* Account Actions with fade-in animation */}
              <div
                className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2
                           animate-fadeInUp"
                style={{
                  animationDelay: "500ms",
                  animationFillMode: "both",
                }}
              >
                {currentUser ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-4 p-4 
                                 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400
                                 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl
                                 transition-all duration-200 transform hover:scale-105"
                    >
                      <User size={20} />
                      <span className="font-medium">Profile</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-4 p-4 
                                 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400
                                 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl
                                 transition-all duration-200 transform hover:scale-105"
                    >
                      <Settings size={20} />
                      <span className="font-medium">Settings</span>
                    </Link>

                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-4 p-4 
                                 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30
                                 rounded-xl transition-all duration-200 transform hover:scale-105"
                    >
                      <LogOut size={20} />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/sign-in"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-center p-4 
                                 border border-orange-600 text-orange-600 dark:text-orange-400
                                 rounded-xl font-semibold hover:bg-orange-50 dark:hover:bg-orange-950/20
                                 transition-all duration-200 transform hover:scale-105"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/sign-up"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-center p-4 
                                 bg-orange-600 hover:bg-orange-700 text-white
                                 rounded-xl font-semibold
                                 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
