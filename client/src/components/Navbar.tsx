import { Link, useNavigate } from "react-router-dom";
import ThemeToggler from "./ThemeToggler";
import { Search, Menu, X, Plus } from "lucide-react";
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
      navigate("/sign-in", { replace: true });
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
            <form className="w-full">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search properties..."
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <ul className="flex items-center space-x-6">
              {[
                ...(currentUser
                  ? [{ to: "/", label: "Home" }]
                  : [{ to: "/overview", label: "Overview" }]),
                { to: "/contact", label: "Contact" },
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
                 text-primary border border-default 
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
                         transition-colors duration-200 group"
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
               transition-colors duration-200 font-medium px-3 py-1.5"
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
                       p-2 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form>
            <div className="relative">
              <input
                type="text"
                placeholder="Search properties..."
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
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-nav border-t border-default shadow-lg">
          <div className="px-4 py-3 space-y-3">
            {[
              ...(currentUser
                ? [{ to: "/", label: "Home" }]
                : [{ to: "/overview", label: "Overview" }]),
              { to: "/contact", label: "Contact" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="block text-primary hover:text-accent 
                         transition-colors duration-200 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            ))}

            {/* Mobile Create Listing Button */}
            {currentUser && (
              <Link
                to="/create-listing"
                className="btn-primary px-4 py-3 rounded-xl font-medium text-center
                     transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Plus className="w-4 h-4" />
                <span>List Your Property</span>
              </Link>
            )}
            {/* Mobile Auth/Profile Section */}
            <div className="pt-3 border-t border-default space-y-3">
              {currentUser ? (
                // Mobile Profile Section
                <>
                  <div className="flex items-center space-x-3 py-2">
                    <img
                      src={
                        currentUser.avatar?.url ||
                        `https://ui-avatars.com/api/?name=${currentUser.username}&background=f97316&color=fff`
                      }
                      alt={currentUser.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-primary font-medium text-sm">
                        {currentUser.fullname || currentUser.username}
                      </p>
                      <p className="text-muted text-xs">{currentUser.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="block text-primary hover:text-accent 
                 transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block text-primary hover:text-accent 
                 transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left text-red-600 dark:text-red-400
                 transition-colors duration-200 font-medium py-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                // Mobile Auth Buttons
                <>
                  <Link
                    to="/sign-in"
                    className="block text-primary hover:text-accent 
                 transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/sign-up"
                    className="block btn-primary px-4 py-2 rounded-full font-medium text-center
                 transition-all duration-300 hover:shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
