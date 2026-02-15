// import React from "react";
// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";

// export default function Settings() {
//   return (
//     <div className="d-flex" style={{ backgroundColor: "#f4f9ff", minHeight: "100vh" }}>
//       <Sidebar />
//       <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
//         <Navbar />
//         <div className="container py-4">
//           <div className="card shadow-sm border-0 p-4">
//             <h3 className="fw-bold text-primary mb-3">Market Overview</h3>
//             <p className="text-muted">
//              hey hello we are on the Setting page 
//             </p>

//             <div className="text-center mt-4">
//               <img
//                 src="https://placehold.co/900x400?text=Market+Overview+Graph"
//                 alt="Market Overview"
//                 className="img-fluid rounded-3 shadow-sm"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";
import TradingViewWidget from "../components/TradingViewWidget";
import { closeAccount } from "../api/closeAccount";
export default function Settings() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("site-theme") || "default";
  });
  const navigate = useNavigate();

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

  React.useEffect(() => {
    const saved = localStorage.getItem("site-theme") || theme;
    applyTheme(saved);
  }, []);

  React.useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Go back to previous page
  const handleBack = () => {
    navigate(-1);
  };

  // Example: Go to home/dashboard page
  const handleGoHome = () => {
    navigate("/home");
  };

  return (
    <div className="d-flex " style={{flexDirection:"column", backgroundColor: "var(--body-bg, #f4f9ff)", minHeight: "100vh" }}>
      {isSidebarVisible && <Sidebar />}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: isSidebarVisible ? "250px" : "0",
          transition: "margin-left 0.3s ease",
          backgroundColor: "var(--body-bg, #f4f9ff)",
        }}
      >
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="container py-4">
          <div className="card shadow-sm border-0 p-4" style={{ backgroundColor: "var(--card-bg, #fff)" }}>
            <h3 className="fw-bold text-primary mb-3">Settings Page</h3>
            <p className="text-muted">
              Hey hello 👋 we are on the <strong>Settings</strong> page.
            </p>
            {/* Color Theme Select */}
            <div className="mb-4">
              <label htmlFor="theme-select" className="form-label fw-bold">Color Theme</label>
              <select
                id="theme-select"
                value={theme}
                onChange={(e) => {
                  const t = e.target.value;
                  setTheme(t);
                  try { localStorage.setItem("site-theme", t); } catch (e) {}
                  applyTheme(t);
                }}
                className="form-select form-select-sm"
                style={{ width: 180, backgroundColor: "var(--search-bg, #fff)", color: "var(--search-text, #000)" }}
                title="Choose color theme"
              >
                <option value="default">Default</option>
                <option value="green">Green</option>
                <option value="purple">Purple</option>
                <option value="teal">Teal</option>
                <option value="sunset">Sunset</option>
                <option value="mocha">Mocha</option>
              </select>
            </div>
            {/* ✅ Buttons Section */}
           
          
           
          </div>
        </div>
      </div>
      <div>
       {/* <TradingViewWidget /> */}
    </div>
    </div>
  );
}