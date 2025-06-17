import { Link } from "react-router-dom";
import ThemeToggler from "./ThemeToggler";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-800 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-22">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
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
                  className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                           border border-gray-300 dark:border-gray-600 rounded-full py-2 pl-4 pr-10 
                           focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800
                           transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 
                           text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 
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
                { to: "/", label: "Home" },
                { to: "/about", label: "About" },
                { to: "/contact", label: "Contact" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400 
                             transition-colors duration-200 font-medium relative group"
                  >
                    {label}
                    <span
                      className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 dark:bg-blue-400
                                   transition-all duration-300 group-hover:w-full"
                    ></span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <Link
                to="/sign-in"
                className="text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400 
                         transition-colors duration-200 font-medium px-3 py-1.5"
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 
                         text-white px-4 py-1.5 rounded-full font-medium 
                         transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Sign Up
              </Link>
            </div>

            {/* Theme Toggler */}
            <ThemeToggler />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggler />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400 
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
                className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                         border border-gray-300 dark:border-gray-600 rounded-full py-2 pl-4 pr-10 
                         focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800
                         transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 
                         text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 
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
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="px-4 py-3 space-y-3">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="block text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400 
                         transition-colors duration-200 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <Link
                to="/sign-in"
                className="block text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400 
                         transition-colors duration-200 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="block bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 
                         text-white px-4 py-2 rounded-full font-medium text-center
                         transition-all duration-300 hover:shadow-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
