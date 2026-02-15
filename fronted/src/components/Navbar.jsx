// src/components/Navbar.jsx
// this is a navbar with sidebar toggle functionality
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaSearch, FaTimes, FaBars, FaRegNewspaper } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ toggleSidebar }) => {
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("site-theme") || "default";
    } catch (e) {
      return "default";
    }
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      const query = search.trim();
      setIsSearchOpen(false);
      navigate(`/stock/${encodeURIComponent(query)}`);
      setSearch("");
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsSearchOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    // apply saved theme on mount
    try {
      const saved = localStorage.getItem("site-theme") || theme;
      applyTheme(saved);
    } catch (e) {
      applyTheme(theme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyTheme(name) {
    const root = document.documentElement;
    const themes = {
      default: {
        "--nav-bg": "#1E40AF",
        "--nav-text": "#ffffff",
        "--body-bg": "#f4f9ff",
        "--primary": "#0d6efd",
        "--card-bg": "#ffffff",
        "--search-bg": "#ffffff",
        "--search-text": "#000000",
        "--sidebar-text": "#0b1221",
      },
      green: {
        "--nav-bg": "#065f46",
        "--nav-text": "#e6fff7",
        "--body-bg": "#e6f9f0",
        "--primary": "#10b981",
        "--card-bg": "#f0fdf4",
        "--search-bg": "#ffffff",
        "--search-text": "#000000",
        "--sidebar-text": "#064e3b",
      },
      purple: {
        "--nav-bg": "#5b21b6",
        "--nav-text": "#fff7ff",
        "--body-bg": "#f7f0ff",
        "--primary": "#7c3aed",
        "--card-bg": "#faf5ff",
        "--search-bg": "#ffffff",
        "--search-text": "#000000",
        "--sidebar-text": "#3b0764",
      },
      mocha: {
        // user provided color (8-digit hex includes alpha). Converted to a background with similar transparency.
        "--nav-bg": "rgba(45,35,30,0.58)",
        "--nav-text": "#fff9f6",
        "--body-bg": "#fbf7f5",
        "--primary": "#b9846f",
        "--card-bg": "#fff9f7",
        "--search-bg": "#ffffff",
        "--search-text": "#000000",
        "--sidebar-text": "#2d1f1a",
      },
      
      teal: {
        "--nav-bg": "#0d9488",
        "--nav-text": "#ffffff",
        "--body-bg": "#e6fffb",
        "--primary": "#14b8a6",
        "--card-bg": "#f0fdfc",
        "--search-bg": "#ffffff",
        "--search-text": "#000000",
        "--sidebar-text": "#064e3b",
      },
      // lighter Sunset
      sunset: {
        "--nav-bg": "#ff7a2a",
        "--nav-text": "#fff8f3",
        "--body-bg": "#fff6ee",
        "--primary": "#fb923c",
        "--card-bg": "#fff7ef",
        "--search-bg": "#ffffff",
        "--search-text": "#000000",
        "--sidebar-text": "#7c2d12",
      },
    };

    const picked = themes[name] || themes.default;
    Object.entries(picked).forEach(([k, v]) => root.style.setProperty(k, v));
  }

  return (
    <>
      <nav
        className="navbar navbar-expand-lg shadow-sm"
        style={{
          backgroundColor: "var(--nav-bg, #1E40AF)",
          color: "var(--nav-text, #fff)",
          height: "64px",
          zIndex: 1000,
          position: "relative",
        }}
      >
        <div className="container-fluid px-2 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2" style={{ flex: 1 }}>
            {/* Toggle Sidebar button */}
            <button
              className="btn btn-outline-light me-2"
              onClick={toggleSidebar}
              style={{ padding: '6px 10px' }}
            >
              <FaBars />
            </button>

            {/* Inline Search box */}
            <input
              type="text"
              className="form-control serch border-0 shadow-none"
              placeholder="Search stocks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              style={{ fontSize: "0.95rem", width: "180px", maxWidth: '100%' }}
              onClick={() => setIsSearchOpen(true)}
            />

            {/* News icon for mobile only */}
            <Link to="/user/news" state={{ userInfo: user }} style={{ textDecoration: "none" }}>
              <span className="d-block d-lg-none ms-2">
                <FaRegNewspaper style={{ fontSize: "1.3rem", cursor: "pointer", color: 'var(--nav-text, #fff)' }} />
              </span>
            </Link>
          </div>

          {/* Right section */}
          <div className="d-flex align-items-center gap-2 " style={{ flex: 1, justifyContent: 'flex-end' }}>
            <span className="d-none d-lg-block">
              <Link to="/user/news" state={{ userInfo: user }} style={{ textDecoration: "none" }}>
                <FaBell style={{ fontSize: "1.3rem", cursor: "pointer", color: 'var(--nav-text, #fff)' }} />
              </Link>
            </span>
            <div className="bg-light text-primary fw-bold d-flex align-items-center justify-content-center rounded-circle" style={{ width: "36px", height: "36px" }}>
             <Link to="/user/profile" style={{ textDecoration: "none", color: "inherit" }}>
              {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
            </Link>
            </div>
            <Link to="/user/profile" style={{ textDecoration: "none" }}>
              <span className="fw-semibold d-none d-lg-block" style={{ cursor: "pointer", color: 'var(--nav-text, #fff)' }}>
                {user?.username || "Guest User"}
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {isSearchOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", zIndex: 2000, transition: "all 0.3s ease" }}
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-white rounded-pill shadow-lg d-flex align-items-center px-4"
            style={{ width: "60%", maxWidth: "600px", height: "60px", transition: "all 0.3s ease" }}
            onClick={(e) => e.stopPropagation()}
          >
            <FaSearch className="text-muted me-3" />
            <input
              type="text"
              className="form-control border-0 shadow-none"
              placeholder="Search stocks..."
              value={search}
              autoFocus
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              style={{ fontSize: "1.2rem" }}
            />
            <FaTimes className="text-muted ms-3" style={{ cursor: "pointer" }} onClick={() => setIsSearchOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;


