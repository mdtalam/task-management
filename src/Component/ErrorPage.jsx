import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mt-2">Oops! Page Not Found</h2>
      <p className="text-gray-500 mt-2">
        The page you are looking for might have been removed or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md text-lg font-medium hover:bg-blue-600 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
