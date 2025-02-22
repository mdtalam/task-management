import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProvider";

const Navbar = () => {
  const {user,logOut} = useContext(AuthContext)
  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-white text-2xl font-bold">
          TaskManager
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-white hover:text-gray-200">Login</Link>
          <Link to="/tasks" className="text-white hover:text-gray-200">My Tasks</Link>
          <Link to="/about" className="text-white hover:text-gray-200">About</Link>
        </div>

        {/* Auth Buttons */}
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <img className="w-10 h-10 rounded-full" src={user.photoURL} alt="User" />
              <button
                onClick={logOut}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
