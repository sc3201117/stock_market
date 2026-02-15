// this is previous code without market time limit but fully working means we can buy and sell any time
// // src/pages/OrderBox.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const OrderBox = ({ stock }) => {
  const { user, setUser } = useAuth();

  const [activeTab, setActiveTab] = useState("BUY");
  const [activeOption, setActiveOption] = useState("Delivery");
  const [qty, setQty] = useState("");
  const [priceType, setPriceType] = useState("Market");
  const [limitPrice, setLimitPrice] = useState("");

  const [userHoldings, setUserHoldings] = useState(0);

  // ------------------------------------------------------------
  // ✅ FETCH USER HOLDINGS (BUY - SELL)
  // ------------------------------------------------------------
  useEffect(() => {
    if (!user || !stock) return;

    const loadHoldings = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/portfolio/holdings/${user._id}/${stock.symbol}`
        );

        setUserHoldings(res.data.quantity || 0);
      } catch (err) {
        console.log("Holdings fetch error:", err.response?.data);
        setUserHoldings(0);
      }
    };

    loadHoldings();
  }, [user, stock]);
    console.log("stock in order box:", stock);
  if (!stock) return <div>Loading order box...</div>;

  // ------------------------------------------------------------
  // ✅ HANDLE BUY / SELL
  // ------------------------------------------------------------
  const handleBuySell = async () => {
    if (!user?._id) {
      alert("User not logged in!");
      return;
    }

    const tradedPrice =
      priceType === "Market"
        ? Number(stock.marketPrice)
        : Number(limitPrice);

    if (!tradedPrice || tradedPrice <= 0) {
      alert("Price error");
      return;
    }

    // ------------------------------------------------------------
    // ❌ SELL VALIDATION (DO NOT ALLOW SELL WITHOUT STOCK)
    // ------------------------------------------------------------
    if (activeTab === "SELL") {
      if (userHoldings <= 0) {
        alert("❌ You do not have this stock to sell!");
        return;
      }

      if (Number(qty) > userHoldings) {
        alert(`❌ You only have ${userHoldings} shares`);
        return;
      }
    }

    // ------------------------------------------------------------
    // PAYLOAD
    // ------------------------------------------------------------
    const payload = {
      userId: user._id,
      stockSymbol: stock.symbol,
      companyName: stock.companyName,
      quantity: Number(qty),
      transactionType: activeTab,
      priceType,
      limitPrice: priceType === "Limit" ? Number(limitPrice) : null,
      marketPrice: Number(stock.marketPrice),
      percentChnage: stock.change,
    };

    console.log("🔥 Sending payload:", payload);

    // Validate BUY available balance
    const approxRequired = tradedPrice * Number(qty || 0);
    if (activeTab === "BUY") {
      if (!user || typeof user.balance === "undefined") {
        alert("Please log in to trade");
        return;
      }
      if (approxRequired > user.balance) {
        alert("❌ Insufficient balance to place this buy order");
        return;
      }
    }

    try {
      const res = await axios.post("http://localhost:5000/place/order", payload);
      alert("Order placed successfully!");
      // update user's balance in context if backend returned it
      if (res.data && typeof res.data.balance !== "undefined") {
        setUser({ ...user, balance: res.data.balance });
      }
    } catch (err) {
      alert(err.response?.data?.error || "Order failed");
    }
  };

  // ------------------------------------------------------------
  // UI SECTION (UNCHANGED)
  // ------------------------------------------------------------
  return (
    <div className="second-card d-flex justify-content-center align-items-center mt-5">
      <div
        className="order-box p-4 rounded shadow-sm"
        style={{
          background: "#fff",
          width: "360px",
          borderRadius: "16px",
        }}
      >
        <h2 className="fw-bold mb-2">{stock.companyName}</h2>
        <p className="price text-muted mb-3">
          {stock.exchange} ₹{stock.marketPrice} ({stock.change})
        </p>

        {/* BUY / SELL */}
        <div className="tabs d-flex gap-2 mb-3">
          {["BUY", "SELL"].map((tab) => (
            <button
              key={tab}
              className={`tab btn ${
                activeTab === tab
                  ? tab === "BUY"
                    ? "btn-success text-white"
                    : "btn-danger text-white"
                  : "btn-outline-secondary"
              }`}
              onClick={() => setActiveTab(tab)}
              style={{ flex: 1 }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* OPTIONS */}
        <div className="options d-flex gap-2 mb-3">
          {["Delivery", "Intraday", "MTF 2.44x"].map((opt) => (
            <button
              key={opt}
              className={`opt btn ${
                activeOption === opt
                  ? "btn-primary text-white"
                  : "btn-outline-primary"
              }`}
              onClick={() => setActiveOption(opt)}
              style={{ flex: 1 }}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* FORM */}
        <div className="form mb-3">
          <label className="form-label fw-semibold">Qty</label>
          <input
            type="number"
            className="form-control mb-3"
            placeholder="Enter Quantity"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />

          <label className="form-label fw-semibold">Price</label>
          <select
            className="form-select mb-3"
            value={priceType}
            onChange={(e) => setPriceType(e.target.value)}
          >
            <option>Market</option>
            <option>Limit</option>
          </select>

          {priceType === "Limit" && (
            <input
              type="number"
              className="form-control mb-3"
              placeholder="Enter Limit Price"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
            />
          )}
        </div>

        {/* HOLDINGS INFO */}
        <p className="balance text-secondary small mb-3">
          <span>Balance: ₹{user?.balance ? Number(user.balance).toFixed(2) : "0.00"}</span>
          <br />
          <span>Approx req: ₹{( (priceType === "Market" ? Number(stock.marketPrice) : Number(limitPrice) ) * Number(qty || 0) ).toFixed(2)}</span>
          <br />
          <span className="text-primary fw-bold">
            Your Holdings: {userHoldings} Shares
          </span>
        </p>

        <button
          className={`buy-btn w-100 btn ${
            activeTab === "BUY" ? "btn-success" : "btn-danger"
          }`}
          onClick={handleBuySell}
        >
          {activeTab}
        </button>
      </div>
    </div>
  );
};

export default OrderBox;









