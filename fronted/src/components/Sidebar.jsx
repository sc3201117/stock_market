// src/components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaChartBar,
  FaEye,
  FaWallet,
  FaExchangeAlt,
  FaCogs,
  FaSignOutAlt,
  FaUser,
  FaChartLine,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext"; // ✅ import context

const Sidebar = ({ onClose }) => {
  const [showImgModal, setShowImgModal] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleGoBack = () => navigate(-1);
  const handleGoHome = () => navigate("/user/home");

  return (
    <>
      <div
        className="border-end shadow-sm p-3 d-flex flex-column sidebar-root sidebar-responsive"
        style={{
          width: "250px",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          backgroundColor: "var(--card-bg)",
          zIndex: 1200,
          transition: 'transform 0.3s cubic-bezier(.4,0,.2,1)',
        }}
      >
        {/* Logo and user info */}
        <div className="text-start mb-4 ps-2 ">
          <div className="d-flex align-items-center  gap-2 mb-2 position-relative">
            <FaChartLine style={{ color: "var(--primary)", fontSize: '1.2rem' }} />
            <h5 className="fw-bold mb-0" style={{ color: 'var(--primary)' }}>StockMarket Pro</h5>
            {/* Cross button for mobile only */}
            <button
              className="sidebar-close-btn d-lg-none "
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: 22,
                color: '#333',
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'none',
              }}
              aria-label="Close sidebar"
              onClick={onClose}
            >
              &#10005;
            </button>
          </div>
          {/* ✅ User Profile */}
          <div className="img-sec d-flex align-items-center rounded-4 p-2" style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}>
            <img
              src="https://th.bing.com/th/id/OIP.umekQeOw3UokWqZl39t90wHaEK?w=278&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
              alt="User"
              className="rounded-circle me-2 sidebar-profile-img"
              width="40"
              height="40"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowImgModal(true)}
            />
            <div>
              <h6 className="fw-semibold mb-0" style={{ color: 'var(--sidebar-text, rgba(0,0,0,0.85))' }}>{user?.username || "Guest"}</h6>
              <small style={{ color: 'rgba(0,0,0,0.6)' }}>Investor</small>
            </div>
          </div>
        </div>

        {/* Sidebar Menu */}
        <ul className="nav flex-column text-start mt-4 flex-grow-1">
          <li className="nav-item mb-3">
            <NavLink
              to="/user/home"
              end
              className={({ isActive }) =>
                `nav-link fw-semibold ${
                  isActive ? "active-nav-link" : "nav-link-inactive"
                }`
              }
            >
              <FaHome className="me-2" /> Dashboard
            </NavLink>
          </li>

          <li className="nav-item mb-3">
            <NavLink
              to="/user/market-overview"
              className={({ isActive }) =>
                `nav-link fw-semibold ${
                  isActive ? "active-nav-link" : "nav-link-inactive"
                }`
              }
            >
              <FaChartBar className="me-2" /> Market Overview
            </NavLink>
          </li>

          <li className="nav-item mb-3">
            <NavLink
              to="/user/watchlist"
              className={({ isActive }) =>
                `nav-link fw-semibold ${
                  isActive ? "active-nav-link" : "nav-link-inactive"
                }`
              }
            >
              <FaEye className="me-2" /> My Watchlist
            </NavLink>
          </li>

          <li className="nav-item mb-3">
            <NavLink
              to="/user/portfolio"
              className={({ isActive }) =>
                `nav-link fw-semibold ${
                  isActive ? "active-nav-link" : "nav-link-inactive"
                }`
              }
            >
              <FaWallet className="me-2" /> My Portfolio
            </NavLink>
          </li>

          <li className="nav-item mb-3">
            <NavLink
              to="/user/transaction"
              className={({ isActive }) =>
                `nav-link fw-semibold ${
                  isActive ? "active-nav-link" : "nav-link-inactive"
                }`
              }
            >
              <FaExchangeAlt className="me-2" /> Transactions
            </NavLink>
          </li>

          <li className="nav-item mb-3">
            <NavLink
              to="/user/setting"
              className={({ isActive }) =>
                `nav-link fw-semibold ${
                  isActive ? "active-nav-link" : "nav-link-inactive"
                }`
              }
            >
              <FaCogs className="me-2" /> Settings
            </NavLink>
          </li>

          <div className="mt-auto">
            <li className="nav-item mb-2">
              <NavLink
                to="/user/profile"
                className={({ isActive }) =>
                  `nav-link fw-semibold ${isActive ? "active-nav-link" : "nav-link-inactive"}`
                }
              >
                <FaUser className="me-2" /> Profile
              </NavLink>
            </li>

            {/* Report Section */}
            <li className="nav-item mb-2">
              <NavLink
                to="/user/report"
                className={({ isActive }) =>
                  `nav-link fw-semibold ${isActive ? "active-nav-link" : "nav-link-inactive"}`
                }
              >
                <FaChartBar className="me-2" /> Report
              </NavLink>
            </li>

            <li className="nav-item mb-2">
              <button
                onClick={logout}
                className="btn btn-link nav-link fw-semibold text-danger text-start"
                style={{ color: 'var(--primary)' }}
              >
                <NavLink to="/user/home/logout" className="text-danger text-decoration-none">
                
                <FaSignOutAlt className="me-2" /> Logout
                </NavLink>
              </button>
            </li>

            {/* <div className="d-flex flex-column gap-2 mt-4">
            
              <button
                className="btn btn-primary fw-semibold d-flex align-items-center justify-content-center"
                onClick={handleGoHome}
              >
                <FaArrowRight className="me-2" /> Go Home
              </button>
            </div> */}
          </div>
        </ul>
      </div>
      {/* Modal for maximizing image */}
      {showImgModal && (
        <div className="sidebar-img-modal" onClick={() => setShowImgModal(false)}>
          <div className="sidebar-img-modal-content" onClick={e => e.stopPropagation()}>
            <img
              src="https://th.bing.com/th/id/OIP.umekQeOw3UokWqZl39t90wHaEK?w=278&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
              alt="User Large"
              style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '16px' }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
