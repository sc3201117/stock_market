// this is a layout with sidebar toggle functionality
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import MutualFundDetail from "./MutualFundDetail";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Reports from "../components/Reports";
// import Footer from "../components/Footer";

export default function Report() {
   const [isSidebarVisible, setIsSidebarVisible] = useState(false);
   const { user } = useAuth();
   const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);
   return (
    <div className="d-flex" style={{ background: "linear-gradient(120deg, #e0e7ff 0%, #f0fdfa 100%) fixed", minHeight: "100vh", position: 'relative', overflow: 'hidden' }}>
      {/* Decorative background pattern */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        right: '-120px',
        width: 380,
        height: 380,
        background: 'radial-gradient(circle at 60% 40%, #6366f1 0%, #e0e7ff 80%)',
        opacity: 0.22,
        borderRadius: '50%',
        zIndex: 1,
        filter: 'blur(2px)'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        left: '-100px',
        width: 260,
        height: 260,
        background: 'radial-gradient(circle at 40% 60%, #a5b4fc 0%, #f0fdfa 80%)',
        opacity: 0.13,
        borderRadius: '50%',
        zIndex: 1,
        filter: 'blur(1.5px)'
      }}></div>
      {/* Sidebar */}
      <div style={{ position: "fixed", zIndex: 1040 }}>
        {isSidebarVisible && <Sidebar />}
      </div>
      <div
        className="flex-grow-1"
        style={{
          marginLeft: isSidebarVisible ? "250px" : "0",
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-xl-11 col-lg-12 col-md-12"> {/* Increased width */}
              <div className="card shadow-lg border-0 rounded-5 p-5 animate__animated animate__fadeInUp" style={{
                background: 'rgba(255,255,255,0.92)',
                minHeight: 520,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 12px 40px 0 rgba(99,102,241,0.13)',
                border: '1.5px solid #e0e7ff',
                position: 'relative',
                transition: 'box-shadow 0.2s',
                animationDelay: '0.1s'
              }}>
                <div className="d-flex align-items-center mb-4 pb-2" style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <span className="me-4 d-flex align-items-center justify-content-center shadow" style={{ width: 62, height: 62, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 60%, #a5b4fc 100%)', boxShadow: '0 4px 16px #6366f144' }}>
                    <i className="fas fa-file-alt" style={{ fontSize: 32, color: '#fff' }}></i>
                  </span>
                  <div>
                    <h2 className="fw-bold mb-1" style={{ color: '#312e81', letterSpacing: 0.5, fontSize: 32 }}>Trade Report</h2>
                    <p className="text-muted mb-0" style={{ fontSize: 17, fontWeight: 500 }}>Your detailed trade history &amp; realized P&amp;L</p>
                  </div>
                </div>
                {/* Main Reports Table/Content */}
                <Reports/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
