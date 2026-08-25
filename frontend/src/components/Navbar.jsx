import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">

      <div className="navbar-logo">
        <Link to="/">FurniRent</Link>
      </div>

      <div className="navbar-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/furniture">
          Furniture
        </Link>

        {/* Logged-in user */}
        {user && user.role === "user" && (
          <Link to="/my-rentals">
            My Rentals
          </Link>
        )}

        {/* Admin */}
        {user && user.role === "admin" && (
          <Link to="/admin">
            Admin Dashboard
          </Link>
        )}

        {/* Logged out */}
        {!user && (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        )}

        {/* Logged in */}
        {user && (
          <button
            type="button"
            onClick={logout}
            className="navbar-logout"
          >
            Logout
          </button>
        )}

      </div>

    </nav>
  );
}

export default Navbar;