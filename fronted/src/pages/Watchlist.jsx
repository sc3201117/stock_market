import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Watchlists from "../components/Watchlists";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
export default function Watchlist() {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
        const { user } = useAuth();
      
        const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);
  return (
    <div className="d-flex" style={{ backgroundColor: "var(--body-bg)", minHeight: "100vh" }}>
      {isSidebarVisible && <Sidebar />}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: isSidebarVisible ? "250px" : "0",
          transition: "margin-left 0.3s ease",
          backgroundColor: "var(--body-bg)",
        }}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="container py-4">
          <Watchlists user={user} />
        </div>
        {/* Show Footer only when Sidebar is NOT visible */}
         {!isSidebarVisible && (
           <div className="container-fluid p-0">
             <Footer />
           </div>
         )}
      </div>
    </div>
  );
}