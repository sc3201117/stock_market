// ✅ src/components/Navbar2.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBell,
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Navbar2 = () => {
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const { user } = useAuth();

  // 🔍 Handle search submission
  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      setIsSearchOpen(false);
      navigate(`/stock/${encodeURIComponent(search.trim())}`);
      setSearch("");
      setSuggestions([]);
    }
  };

  // ⏪ Back & ⏩ Forward navigation
  const handleGoBack = () => {
    if (window.history.length > 1) navigate(-1);
  };
  const handleGoForward = () => navigate(1);

  // 📊 Fetch NSE autocomplete dynamically
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.trim().length < 1) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await axios.get(
          `https://www.nseindia.com/api/search/autocomplete?q=${search}`,
          {
            headers: {
              "User-Agent": "Mozilla/5.0",
              Accept: "application/json",
            },
          }
        );
        if (response.data && Array.isArray(response.data)) {
          setSuggestions(response.data.slice(0, 10));
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error("Suggestion fetch failed:", err.message);
        setSuggestions([]);
      }
    };

    const timeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  // ⌨️ Close overlay on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setSuggestions([]);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      {/* ===== Main Navbar ===== */}
      <nav
        className="navbar navbar-expand-lg shadow-sm"
        style={{
          backgroundColor: "#1E40AF",
          color: "#fff",
          height: "64px",
          zIndex: 1000,
          position: "relative",
        }}
      >
        <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
          {/* ✅ Left Section: Navigation Buttons + Title */}
          <div className="d-flex gap-3 align-items-center">
            <button
              onClick={handleGoBack}
              className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
              style={{
                borderRadius: "50%",
                width: "36px",
                height: "36px",
              }}
            >
              <FaArrowLeft className="text-primary" />
            </button>
            <button
              onClick={handleGoForward}
              className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
              style={{
                borderRadius: "50%",
                width: "36px",
                height: "36px",
              }}
            >
              <FaArrowRight className="text-primary" />
            </button>

            <h4 className="fw-bold mb-0 text-white ms-2">StockMarketPro</h4>

            {/* ✅ Search Input (click to open fullscreen) */}
            <div
              className="bg-white rounded-pill d-flex align-items-center px-3 shadow-sm"
              style={{
                width: "350px",
                height: "40px",
                cursor: "pointer",
              }}
              onClick={() => setIsSearchOpen(true)}
            >
              <FaSearch className="text-muted me-2" />
              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="Search stocks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                style={{ fontSize: "0.95rem" }}
                readOnly
              />
            </div>
          </div>

          {/* ✅ Right Section (Notifications & User Info) */}
          <div className="d-flex align-items-center gap-3">
            {/* 🔔 Notifications */}
            <Link
              to="/home/news"
              state={{ userInfo: user }}
              style={{ textDecoration: "none" }}
            >
              <FaBell
                className="text-white"
                style={{ fontSize: "1.3rem", cursor: "pointer" }}
              />
            </Link>

            {/* 👤 User Info */}
            <div className="d-flex align-items-center gap-2">
              <div
                className="bg-light text-primary fw-bold d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: "36px", height: "36px" }}
              >
                {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
              </div>
              <Link to="/home/profile" style={{ textDecoration: "none" }}>
                <span
                  className="fw-semibold text-white"
                  style={{ cursor: "pointer" }}
                >
                  {user?.username || "Guest User"}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== Fullscreen Search Overlay ===== */}
      {isSearchOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 2000,
          }}
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-white rounded-pill shadow-lg d-flex align-items-center px-4"
            style={{
              width: "60%",
              maxWidth: "600px",
              height: "60px",
            }}
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
            <FaTimes
              className="text-muted ms-3"
              style={{ cursor: "pointer" }}
              onClick={() => setIsSearchOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ✅ Suggestion Dropdown (only visible in overlay mode) */}
      {isSearchOpen && suggestions.length > 0 && (
        <div
          className="position-fixed bg-white shadow rounded"
          style={{
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "60%",
            maxWidth: "600px",
            maxHeight: "250px",
            overflowY: "auto",
            borderRadius: "12px",
            zIndex: 2050,
          }}
        >
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                navigate(`/stock/${encodeURIComponent(item.symbol)}`);
                setIsSearchOpen(false);
                setSearch("");
                setSuggestions([]);
              }}
              className="px-3 py-2 border-bottom"
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f2f2f2")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "white")
              }
            >
              <strong>{item.symbol}</strong> —{" "}
              <span className="text-muted">{item.symbol_info}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar2;
