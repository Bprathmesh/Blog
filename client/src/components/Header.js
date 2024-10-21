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
    <header className="bg-primary-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link to="/" className="text-3xl font-serif font-bold">MyBlog</Link>
        <nav className="space-x-4">
          {userInfo ? (
            <>
              <Link
                to="/create"
                className="bg-secondary-500 hover:bg-secondary-600 text-white py-2 px-4 rounded transition-colors"
              >
                Create Post
              </Link>
              <button
                onClick={handleLogout}
                className="bg-primary-800 hover:bg-primary-900 text-white py-2 px-4 rounded transition-colors"
              >
                Logout ({userInfo.username})
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`${location.pathname === '/login' ? 'text-secondary-300' : 'text-white'} hover:text-secondary-200 transition-colors`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`${location.pathname === '/register' ? 'text-secondary-300' : 'text-white'} hover:text-secondary-200 transition-colors`}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}