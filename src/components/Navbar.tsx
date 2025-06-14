import { Link } from "react-router-dom";
import ThemeToggler from "./ThemeToggler";
import { Search } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-slate-800 text-white">
      <Link to="/" className="font-bold text-sm sm:text-xl flex flex-wrap">
        <span className="text-blue-800">HELLO</span>
        <span className="text-amber-200">Estate</span>
      </Link>
      <form>
        <div className="flex items-center space-x-2rounded-md p-2 ">
          <input
            type="text"
            placeholder="Search..."
            className="focus:outline-none"
          />
          <Search />
        </div>
      </form>
      <div className="flex space-x-4 items-center">
        <ul className="flex items-center space-x-4">
          <li className="text-sm sm:text-base">
            <Link to="/" className="hover:text-blue-400">
              Home
            </Link>
          </li>
          <li className="text-sm sm:text-base">
            <Link to="/about" className="hover:text-blue-400">
              About
            </Link>
          </li>
          <li className="text-sm sm:text-base">
            <Link to="/contact" className="hover:text-blue-400">
              Contact
            </Link>
          </li>
          <li className="text-sm sm:text-base">
            <Link to="/sign-in" className="hover:text-blue-400">
              Sign In
            </Link>
          </li>
          <li className="text-sm sm:text-base">
            <Link to="/sign-up" className="hover:text-blue-400">
              Sign Up
            </Link>
          </li>
        </ul>

        <ThemeToggler />
      </div>
    </nav>
  );
};

export default Navbar;
