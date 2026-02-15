// this is a layout with sidebar toggle functionality
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ETFsPage from "../components/additional/ETFsPage";

export default function MutualFundPage() {
   const [isSidebarVisible, setIsSidebarVisible] = useState(true);
        const { user } = useAuth();
      
        const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);
  return (
    <div
      className="d-flex"
      style={{ backgroundColor: "#f4f9ff", minHeight: "100vh" }}
    >
    {isSidebarVisible && <Sidebar />}

      <div
        className="flex-grow-1"
        style={{
          marginLeft: isSidebarVisible ? "250px" : "0",
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        <div className="container py-4">
             <ETFsPage/>
         
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
