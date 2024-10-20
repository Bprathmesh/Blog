import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";

export default function Header() {
  const { userInfo, logout } = useContext(UserContext);
  const location = useLocation();

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-sm">
      <Link to="/" className="text-2xl font-bold text-gray-800">MyBlog</Link>
      <nav className="space-x-4">
        {userInfo ? (
          <>
            <Link
              to="/create"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Create new post
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Logout ({userInfo.username})
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`${location.pathname === '/login' ? 'text-blue-600' : 'text-gray-600'} hover:text-gray-900 transition-colors`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`${location.pathname === '/register' ? 'text-blue-600' : 'text-gray-600'} hover:text-gray-900 transition-colors`}
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}