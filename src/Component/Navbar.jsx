import { useContext, useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai"; // Importing icons
import { Link } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProvider";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false); // State to toggle menu

  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-white text-2xl font-bold">
          TaskManager
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-white hover:text-gray-200">Home</Link>
          <Link to="/all-task" className="text-white hover:text-gray-200">All Task</Link>
          <Link to="/tasks" className="text-white hover:text-gray-200">My Tasks</Link>
          <Link to="/add-task" className="text-white hover:text-gray-200">Add Task</Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
        </button>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <img className="w-10 h-10 rounded-full" src={user.photoURL} alt="User" />
              <button
                onClick={logOut}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 py-4 flex flex-col items-center space-y-4">
          <Link to="/" className="text-white hover:text-gray-200" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/tasks" className="text-white hover:text-gray-200" onClick={() => setMenuOpen(false)}>My Tasks</Link>
          <Link to="/add-task" className="text-white hover:text-gray-200" onClick={() => setMenuOpen(false)}>Add Task</Link>

          {/* Auth Buttons (Mobile) */}
          {user ? (
            <>
              <img className="w-10 h-10 rounded-full" src={user.photoURL} alt="User" />
              <button
                onClick={() => { logOut(); setMenuOpen(false); }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
