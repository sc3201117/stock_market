











// src/pages/StockPage.jsx
import React, { useState } from "react";
import Navbar2 from "../components/Navbar2";
import Stock from "../components/Stock";
import OrderBox from "../components/OrderBox";
import Footer from "../components/Footer";

const StockPage = () => {

  // 🔥 NEW STATE TO HOLD STOCK DATA
  const [selectedStockData, setSelectedStockData] = useState(null);

  return (
    <div
      style={{
        backgroundColor: "#f9fbff",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <Navbar2 />

      <div
        className="container-fluid"
        style={{
          display: "flex",
          gap: "20px",
          padding: "20px 40px",
        }}
      >
        <div
          style={{
            width: "72%",
            height: "calc(100vh - 80px)",
            overflowY: "auto",
            paddingRight: "10px",
          }}
        >
          {/* 🔥 SEND CALLBACK TO STOCK */}
          <Stock setStockForOrderBox={setSelectedStockData} />
        </div>

        <div
          style={{
            width: "28%",
            position: "sticky",
            top: "80px",
            alignSelf: "flex-start",
          }}
        >
          {/* 🔥 SEND STOCK DATA TO ORDERBOX */}
          <OrderBox stock={selectedStockData} />
        </div>
      </div>

      <div className="container-fluid p-0">
        <Footer />
      </div>
    </div>
  );
};

export default StockPage;
