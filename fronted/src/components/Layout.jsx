// src/components/Layout.jsx
import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import { useAuth } from "../context/AuthContext";
import IndexList from "./IndexList";
import TopGainers from "./TopGainers";
import ProductsTools from "./ProductsTools";
import IndustryStocks from "./IndustryStocks";

const Layout = ({ mainComponent }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const { user } = useAuth();

  const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);

  // Responsive sidebar overlay for mobile
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const isMobile = windowWidth <= 900;
  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Overlay for mobile sidebar
  

  return (
    <div className="d-flex">
      {/* Sidebar for desktop, overlay for mobile */}
      {isSidebarVisible && (
        isMobile ? (
          <>
            <div
              className="sidebar-overlay"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.35)',
                zIndex: 1100,
              }}
              onClick={() => setIsSidebarVisible(false)}
            />
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 1200,
                height: '100vh',
                width: 250,
                background: 'var(--card-bg)',
                boxShadow: '2px 0 16px rgba(0,0,0,0.08)',
                transform: 'translateX(0)',
                transition: 'transform 0.3s cubic-bezier(.4,0,.2,1)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <Sidebar onClose={() => setIsSidebarVisible(false)} />
            </div>
          </>
        ) : (
          <Sidebar />
        )
      )}

      <div
        className="flex-grow-1"
        style={{
          marginLeft: !isMobile && isSidebarVisible ? "250px" : "0",
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        {mainComponent === "market-overview" ? (
          <div className="container py-4">
            <div className="market-responsive">
              <IndexList />
              <div className="market-flex">
                <div className="market-col">
                  <TopGainers
                    cardStyle={{
                      boxShadow: "0 4px 18px rgba(30,64,175,0.08)",
                      borderRadius: 16,
                      background: "#fff",
                      padding: 18,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                    compact
                  />
                </div>
                <div className="market-col">
                  <ProductsTools
                    columnLayout
                    cardStyle={{
                      boxShadow: "0 4px 18px rgba(30,64,175,0.08)",
                      borderRadius: 16,
                      background: "#fff",
                      padding: 18,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  />
                </div>
              </div>
              <IndustryStocks stocks={[]} />
            </div>
            <style>{`
              .market-responsive {
                width: 100%;
                max-width: 100vw;
              }
              .market-flex {
                display: flex;
                gap: 16px;
                margin: 32px 0;
                align-items: stretch;
                min-height: 420px;
              }
              .market-col {
                flex: 1;
                display: flex;
                flex-direction: column;
                min-width: 0;
              }
              @media (max-width: 900px) {
                .market-flex {
                  flex-direction: column;
                  gap: 16px;
                  margin: 16px 0;
                }
                .market-col {
                  min-width: 0;
                  width: 100%;
                }
              }
              @media (max-width: 450px) {
                .container {
                  padding: 4px !important;
                }
                .market-flex {
                  flex-direction: column;
                  gap: 8px;
                  margin: 8px 0;
                }
                .market-col {
                  min-width: 0;
                  width: 100%;
                }
                .market-responsive {
                  padding: 0;
                }
              }
            `}</style>
          </div>
        ) : (
          <MainContent user={user} />
        )}
      </div>
    </div>
  );
};

// Ensure viewport meta tag for mobile scaling
if (typeof document !== "undefined") {
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.name = "viewport";
    viewport.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
    document.head.appendChild(viewport);
  } else {
    viewport.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
  }
}
export default Layout;
