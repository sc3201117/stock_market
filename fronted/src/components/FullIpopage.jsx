import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom"; // this renders nested routes
import { useAuth } from "../context/AuthContext";
import IPOPage from "../components/additional/IPOPage";
import Footer from "./Footer";
export default function FullIpopage(props) {
  const { user } = useAuth();
  const handleLogout = props.handleLogout;
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
         
        
          const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);
  return (
    <div className="d-flex" style={{ backgroundColor: "#f4f9ff", minHeight: "100vh" }}>
      {isSidebarVisible && <Sidebar user={user} handleLogout={handleLogout} />}
     <div
        className="flex-grow-1"
        style={{
          marginLeft: isSidebarVisible ? "250px" : "0",
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Navbar */}
        <Navbar user={user} toggleSidebar={toggleSidebar} />
        <div className="container-fluid py-3">
          <IPOPage/>
        </div>
         {!isSidebarVisible && (
           <div className="container-fluid p-0">
             <Footer />
           </div>
         )}
      </div>
    </div>
  );
}