// this is a simple navbar without fully screen toggle functionality
// import React from "react";
// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";
// import Watchlists from "../components/Watchlists";
// import Profile from "./Profile";
// export default function Watchlist() {
    
//   return (
//     <div className="d-flex" style={{ backgroundColor: "#f4f9ff", minHeight: "100vh" }}>
//       <Sidebar />
//       <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
//         <Navbar />
//         <div className="container py-4">
//          <Profile/>
//         </div>
//       </div>
//     </div>
//   );
// }







// this is a layout with sidebar toggle functionality
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Watchlists from "../components/Watchlists";
import Profile from "./Profile";
import { useAuth } from "../context/AuthContext";

export default function Watchlist() {
  // Sidebar is hidden by default now
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { user } = useAuth();
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const isMobile = windowWidth <= 900;

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
          marginLeft: !isMobile && isSidebarVisible ? "250px" : "0",
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        <div className="container py-4">
          <Profile />
        </div>
      </div>
    </div>
  );
}
