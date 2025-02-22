import { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc"; // Import Google icon
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../Providers/AuthProvider";
import { saveUserToDb } from "../userInfoSave/utils";

const Login = () => {
  const { googleSignin, logOut, user,setUser } = useContext(AuthContext);
  const [userError, setUserError] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/tasks";

  // Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      const data = await googleSignin();
      // Save user data to database
      await saveUserToDb(data?.user);
      setUser(data.user)
      Swal.fire({
        position: "center",
        icon: "success",
        title: "User Login Successful!",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate(from, { replace: true });
    } catch (err) {
      setUserError((prevError) => ({ ...prevError, login: err.code }));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
        {user ? (
          <div>
            <img
              src={user?.photoURL || "https://via.placeholder.com/150"}
              alt={user?.displayName}
              className="w-20 h-20 rounded-full mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold">{user.displayName}</h2>
            <p className="text-gray-600">{user.email}</p>
            <button
              onClick={logOut}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold">Sign in</h2>
            <p className="text-gray-500 mt-2">Access your task manager</p>
            <button
              onClick={handleGoogleLogin}
              className="mt-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full justify-center"
            >
              <FcGoogle className="text-2xl" /> {/* Using React Icon */}
              Sign in with Google
            </button>
            {userError.login && (
              <p className="text-red-600 text-sm">{userError.login}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
