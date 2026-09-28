import { useState } from "react";
import { 
  Link, 
  NavLink,
  useNavigate 
} from "react-router";

import { useAuth } from "../../features/auth/useAuth";
import { supabase } from "../../lib/supabase";
import { useTheme } from "../../hooks/useTheme";

import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const { user } = useAuth();

  const { theme, toggleTheme } = useTheme();

  function closeMenu() {
    setMenuOpen(false);
  }

  async function handleLogout() {
  const { error } =
    await supabase.auth.signOut();

  if (error) {
    console.error(
      "Unable to sign out:",
      error,
    );

    return;
  }

  closeMenu();

  navigate("/", {
    replace: true,
  });
}

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >
          Marvelist
        </Link>

        <button
          className="navbar-menu-button"
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          ☰
        </button>

        <nav
          className={`navbar-navigation ${
            menuOpen ? "navbar-navigation-open" : ""
          }`}
        >
          <div className="navbar-links">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive ? "navbar-link active" : "navbar-link"
              }
              onClick={closeMenu}
            >
              Home
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "navbar-link active" : "navbar-link"
              }
              onClick={closeMenu}
            >
              Profile
            </NavLink>

            <NavLink
              to="/list"
              className={({ isActive }) =>
                isActive ? "navbar-link active" : "navbar-link"
              }
              onClick={closeMenu}
            >
              Video List
            </NavLink>

            <NavLink
              to="/browse"
              className={({ isActive }) =>
                isActive ? "navbar-link active" : "navbar-link"
              }
              onClick={closeMenu}
            >
              Browse
            </NavLink>
          </div>

          <div className="navbar-actions">
            <button
              className="theme-button"
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === "light"
                  ? "Switch to dark theme"
                  : "Switch to light theme"
              }
              title={
                theme === "light"
                  ? "Switch to dark theme"
                  : "Switch to light theme"
              }
            >
              {theme === "light" ? "☾" : "☀"}
            </button>

            {user ? (
              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                Log Out
              </button>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="signin-link"
                  onClick={closeMenu}
                >
                  Sign In
                </NavLink>

                <NavLink
                  to="/signup"
                  className="signup-link"
                  onClick={closeMenu}
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;