import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
export default function Portfolio() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);

  const [orders, setOrders] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modifyQty, setModifyQty] = useState("");
  const [modifyPrice, setModifyPrice] = useState("");
  const [modifyPriceType, setModifyPriceType] = useState("limit");
  const [modifyMarketPrice, setModifyMarketPrice] = useState("");
  const [modifyLoading, setModifyLoading] = useState(false);

  // ⭐ Read the tab from URL


  const location = useLocation();

  let activeTab = "holdings";

  if (location.pathname.includes("orders")) activeTab = "orders";
  if (location.pathname.includes("completed")) activeTab = "completed";


  // Fetch orders and holdings
  const fetchOrders = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`http://localhost:5000/orders/${user._id}`);
      const ordersData = res.data.orders || [];
      setOrders(ordersData);
      // -------------------------------
      // 🔥 HOLDINGS FROM COMPLETED ORDERS ONLY
      // -------------------------------
      const map = {};
      if (Array.isArray(ordersData)) {
        ordersData
          .filter((o) => o.status === "COMPLETED")
          .forEach((o) => {
            if (!map[o.symbol]) {
              map[o.symbol] = {
                symbol: o.symbol,
                companyName: o.companyName,
                qty: 0,
                avgPrice: 0,
                investedValue: 0,
                currentPrice: 0,
                currentValue: 0,
                lastDate: o.date,
                buyCount: 0,
                firstBuyPrice: null,
              };
            }
            if (o.side === "BUY") {
              map[o.symbol].qty += o.qty;
              map[o.symbol].investedValue += o.qty * o.tradedPrice;
              map[o.symbol].buyCount += 1;
              if (map[o.symbol].firstBuyPrice === null) {
                map[o.symbol].firstBuyPrice = o.tradedPrice;
              }
            } else {
              map[o.symbol].qty -= o.qty;
              map[o.symbol].investedValue -= o.qty * o.tradedPrice;
            }
            map[o.symbol].lastDate = o.date;
          });
      }
      const finalHoldings = Object.values(map).filter((h) => h.qty > 0);
      console.log("Computed Holdings:", finalHoldings);
      finalHoldings.forEach((h) => {
        if (h.buyCount === 1) {
          h.avgPrice = Number(h.firstBuyPrice).toFixed(4);
        } else {
          h.avgPrice = (h.investedValue / h.qty).toFixed(4);
        }
      });
      await fetchLivePrices(finalHoldings);
      setHoldings(finalHoldings);
    } catch (err) {
      console.error("❌ Failed to load orders:", err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [user]);

  // Auto-refresh orders every 5 seconds when 'orders' tab is active
  useEffect(() => {
    if (activeTab !== "orders" || !user?._id) return;
    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeTab, user]);




  

  // ===== FETCH LIVE PRICES =====
  const fetchLivePrices = async (holdingsData) => {
    try {
      const symbols = holdingsData.map(h => h.symbol);
      if (symbols.length === 0) return;

      const res = await axios.post(`http://localhost:5000/live-prices`, { symbols });
      const prices = res.data.prices || {};
      const changes = res.data.changes || {};
      const yesterdayCloses = res.data.yesterdayCloses || {}; // <-- Add this to backend response
      holdingsData.forEach((h) => {
        const livePrice = prices[h.symbol];
        const dailyChange = changes[h.symbol];
        const yesterdayClose = yesterdayCloses[h.symbol];
        if (livePrice) {
          h.currentPrice = livePrice;
          h.currentValue = Number((h.qty * livePrice).toFixed(2));
          h.dailyChangePercent = dailyChange || 0;
          h.yesterdayClosePrice = yesterdayClose || livePrice; // fallback if not available
        } else {
          h.currentPrice = Number(h.avgPrice);
          h.currentValue = Number((h.qty * h.currentPrice).toFixed(2));
          h.dailyChangePercent = dailyChange || 0;
          h.yesterdayClosePrice = yesterdayClose || h.currentPrice;
        }
      });
      setHoldings([...holdingsData]);
    } catch (err) {
      console.error("Failed to fetch live prices:", err);
      holdingsData.forEach((h) => {
        h.currentPrice = Number(h.avgPrice);
        h.currentValue = Number((h.qty * h.currentPrice).toFixed(2));
        h.dailyChangePercent = 0;
        h.yesterdayClosePrice = h.currentPrice;
      });
      setHoldings([...holdingsData]);
    }
  };

  // ===== AUTO-REFRESH PRICES EVERY 5 SECONDS =====
  useEffect(() => {
    if (holdings.length === 0) return;

    const interval = setInterval(async () => {
      await fetchLivePrices(holdings);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [holdings.length]);

  const goToStock = (symbol) => navigate(`/stock/${symbol}`);

  // Separate orders (ensure orders is an array before filtering)

  const pendingOrders = orders && Array.isArray(orders) ? orders.filter((o) => o.status === "PENDING") : [];

  // Open modify modal
  const openModifyModal = async (order) => {
    setSelectedOrder(order);
    setModifyQty(order.qty.toString());
    setModifyPrice(order.limitPrice.toString());
    setModifyPriceType("limit");
    setShowModifyModal(true);

    // Fetch live market price for this symbol
    try {
      const pricesRes = await axios.post("http://localhost:5000/live-prices", {
        symbols: [order.symbol]
      });
      // console.log("Live prices response for modify modal:", pricesRes.data);
      if (pricesRes.data.success && pricesRes.data.prices && pricesRes.data.prices[order.symbol]) {
        const price = pricesRes.data.prices[order.symbol];
        if (price) {
          setModifyMarketPrice(price.toString());
        }
      }
    } catch (err) {
      console.error("Failed to fetch market price:", err);
    }
  };

  // Handle modify order
  const handleModifyOrder = async () => {
    if (!selectedOrder || !modifyQty) {
      alert("Please fill in all fields");
      return;
    }

    const priceToUse = modifyPriceType === "limit" ? modifyPrice : modifyMarketPrice;
    if (!priceToUse || Number(priceToUse) === 0) {
      alert("Please enter valid price");
      return;
    }

    setModifyLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:5000/modify-order/${selectedOrder._id}`,
        {
          userId: user._id,
          newQty: Number(modifyQty),
          newLimitPrice: Number(priceToUse),
          priceType: modifyPriceType,
        }
      );

      alert("Order modified successfully!");
      // Refresh orders
      const ordersRes = await axios.get(`http://localhost:5000/orders/${user._id}`);
      setOrders(ordersRes.data.orders);
      // console.log("Orders after modification:", ordersRes.data.orders);
      // Update user balance in context
      if (res.data && res.data.balance !== undefined) {
        setUser({ ...user, balance: res.data.balance });
      }
      setShowModifyModal(false);
      setSelectedOrder(null);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to modify order");
    } finally {
      setModifyLoading(false);
    }
  };

  // Calculate quantity at yesterday's close for each holding
  function getQtyAtYesterdayClose(symbol, orders, yesterdayDate) {
    let qty = 0;
    orders
      .filter(o => o.symbol === symbol && o.status === "COMPLETED")
      .forEach(o => {
        const orderDate = new Date(o.date);
        // Only count orders before the start of today
        if (orderDate < yesterdayDate) {
          qty += o.side === "BUY" ? o.qty : -o.qty;
        }
      });
    return qty;
  }

  return (
    <div className="d-flex" style={{ backgroundColor: "#f4f9ff", minHeight: "100vh" }}>
      {isSidebarVisible && <Sidebar />}

      <div
        className="flex-grow-1"
        style={{
          marginLeft: isSidebarVisible ? "250px" : "0",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Navbar toggleSidebar={toggleSidebar} />

        <div className="container py-4">
          <div className="card shadow-sm border-0 p-4">

            {/* ⭐ TABS WITH URL ROUTING */}
            <div className="d-flex mb-4 gap-3">
              <button
                className={`btn ${activeTab === "holdings" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => navigate("/user/portfolio/holdings")}
              >
                Holdings
              </button>

              <button
                className={`btn ${activeTab === "orders" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => navigate("/user/portfolio/orders")}
              >
                Orders
              </button>


            </div>

            {/* HOLDINGS TAB */}
            {activeTab === "holdings" && (
              <div>
                {/* ===== SUMMARY SECTION ===== */}
                {holdings.length > 0 && (
                  <div className="card mb-4" style={{ backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-3 text-start">
                          <div className="mb-2">
                            <small className="text-muted">Current Value</small>
                          </div>
                          {(() => {
                            const currentVal = holdings.reduce((sum, h) => sum + (h.currentValue || 0), 0);
                            const investedVal = holdings.reduce((sum, h) => sum + (h.investedValue || 0), 0);
                            const isLoss = currentVal < investedVal;
                            return (
                              <h4 className={`fw-bold ${isLoss ? 'text-danger' : 'text-success'}`}>
                                ₹{currentVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </h4>
                            );
                          })()}
                        </div>

                        <div className="col-md-3 text-start">
                          <div className="mb-2">
                            <small className="text-muted">Invested Value</small>
                          </div>
                          <h5 className="fw-bold text-dark">
                            ₹{holdings.reduce((sum, h) => sum + (h.investedValue || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </h5>
                        </div>

                        <div className="col-md-3 text-start">
                          <div className="mb-2">
                            <small className="text-muted">Total Holdings</small>
                          </div>
                          <h5 className="fw-bold text-dark">
                            {holdings.reduce((sum, h) => sum + h.qty, 0)} shares
                          </h5>
                        </div>

                        <div className="col-md-3 text-start">
                          <div className="mb-2">
                            <small className="text-muted">1D Return</small>
                          </div>
                          {(() => {
                            // 1D Return = sum of per-holding 1D Return logic (same as table row)
                            let oneDayReturnTotal = 0;
                            let oneDayReturnBase = 0;
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            holdings.forEach(h => {
                              const investedPerShare = Number(h.avgPrice);
                              const currentPrice = h.currentPrice || investedPerShare;
                              const currentTotal = h.currentValue || (currentPrice * h.qty);
                              const investedTotal = h.investedValue || (investedPerShare * h.qty);
                              const pnl = currentTotal - investedTotal;
                              const firstBuyDate = h.lastDate ? new Date(h.lastDate) : null;
                              const boughtToday = firstBuyDate && firstBuyDate >= today;
                              let oneDayReturn = 0;
                              let base = 0;
                              if (boughtToday) {
                                oneDayReturn = pnl;
                                base = investedTotal;
                              } else {
                                const yesterdayClose = h.yesterdayClosePrice || currentPrice;
                                oneDayReturn = (currentPrice - yesterdayClose) * h.qty;
                                base = investedPerShare > 0 ? investedPerShare * h.qty : 0;
                              }
                              oneDayReturnTotal += oneDayReturn;
                              oneDayReturnBase += base;
                            });
                            const oneDayReturnPercent = oneDayReturnBase > 0 ? ((oneDayReturnTotal / oneDayReturnBase) * 100).toFixed(2) : 0;
                            return (
                              <h5 className={`fw-bold ${oneDayReturnTotal >= 0 ? 'text-success' : 'text-danger'}`}>
                                {oneDayReturnTotal >= 0 ? '+' : ''}₹{oneDayReturnTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                <br />
                                <small>({oneDayReturnPercent}%)</small>
                              </h5>
                            );
                          })()}
                        </div>

                        <div className="col-md-3 text-start">
                          <div className="mb-2">
                            <small className="text-muted">Total P&L</small>
                          </div>
                          {(() => {
                            const currentVal = holdings.reduce((sum, h) => sum + (h.currentValue || 0), 0);
                            const investedVal = holdings.reduce((sum, h) => sum + (h.investedValue || 0), 0);
                            const pnl = currentVal - investedVal;
                            const pnlPercent = investedVal > 0 ? ((pnl / investedVal) * 100).toFixed(2) : 0;
                            return (
                              <h5 className={`fw-bold ${pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                                {pnl >= 0 ? '+' : ''}₹{pnl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                <br />
                                <small>({pnlPercent}%)</small>
                              </h5>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ===== HOLDINGS LIST ===== */}
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead style={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #ddd" }}>
                      <tr>
                        <th>Company</th>
                        <th>Market Price (1D%)</th>
                        <th>1D Return</th>
                        <th>Returns (%)</th>
                        <th className="text-end">Current (Invested)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holdings.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-4">No holdings yet.</td>
                        </tr>
                      ) : (
                        holdings.map((h) => {
                          const investedPerShare = Number(h.avgPrice);
                          const investedTotal = h.investedValue || (investedPerShare * h.qty);
                          const currentPrice = h.currentPrice || investedPerShare;
                          const currentTotal = h.currentValue || (currentPrice * h.qty);
                          const pnl = currentTotal - investedTotal;
                          const pnlPercent = investedTotal > 0 ? ((pnl / investedTotal) * 100).toFixed(2) : 0;

                          // Determine if the holding was bought today
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const firstBuyDate = h.lastDate ? new Date(h.lastDate) : null;
                          const boughtToday = firstBuyDate && firstBuyDate >= today;

                          // 1D Return logic
                          let oneDayReturn, oneDayReturnPercent;
                          if (boughtToday) {
                            // If bought today, 1D Return = Total P&L
                            oneDayReturn = pnl;
                            oneDayReturnPercent = pnlPercent;
                          } else {
                            // If not bought today, 1D Return = (Current Price - Yesterday's Close) * Qty
                            const yesterdayClose = h.yesterdayClosePrice || currentPrice;
                            oneDayReturn = (currentPrice - yesterdayClose) * h.qty;
                            oneDayReturnPercent = investedPerShare > 0
                              ? (((currentPrice - yesterdayClose) / investedPerShare) * 100).toFixed(2)
                              : 0;
                          }

                          return (
                            <tr key={h.symbol} style={{ borderBottom: "1px solid #eee" }}>
                              <td>
                                <div>
                                  <strong
                                    onClick={() => goToStock(h.symbol)}
                                    style={{ cursor: "pointer", color: "#007bff" }}
                                  >
                                    {h.symbol}
                                  </strong>
                                  <br />
                                  <small className="text-muted">
                                    {h.qty} shares • Avg. ₹{investedPerShare.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </small>
                                </div>
                              </td>
                              <td>
                                <div>₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                <small className={(h.dailyChangePercent || 0) >= 0 ? 'text-success' : 'text-danger'}>
                                  {(h.dailyChangePercent || 0) >= 0 ? '+' : ''}{(h.dailyChangePercent || 0).toFixed(2)}%
                                </small>
                              </td>
                              <td>
                                <span className={oneDayReturn >= 0 ? 'text-success' : 'text-danger'}>
                                  {oneDayReturn >= 0 ? '+' : ''}₹{oneDayReturn.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  <br />
                                  <small>({oneDayReturnPercent}%)</small>
                                </span>
                              </td>
                              <td>
                                <span className={pnl >= 0 ? 'text-success' : 'text-danger'}>
                                  {pnl >= 0 ? '+' : ''}₹{pnl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  <br />
                                  <small>({pnlPercent}%)</small>
                                </span>
                              </td>
                              <td className="text-end">
                                <div>
                                  <strong>₹{currentTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                  <br />
                                  <small className="text-muted">₹{investedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</small>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PENDING ORDERS TAB */}
            {activeTab === "orders" && (
              <table className="table table-bordered">
                <thead className="table-secondary">
                  <tr>
                    <th>Symbol</th>
                    <th>Side</th>
                    <th>Type</th>
                    <th>Qty</th>
                    <th>Limit Price</th>
                    <th>Amount Used</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center">No pending orders.</td>
                    </tr>
                  ) : (
                    pendingOrders.map((o) => {
                      const holding = holdings.find(h => h.symbol === o.symbol);

                      return (
                        <tr key={o._id}>
                          <td>{o.symbol}</td>
                          <td>
                            <span className={`badge ${o.side === 'BUY' ? 'bg-success' : 'bg-danger'}`}>
                              {o.side}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-info">{o.priceType}</span>
                          </td>
                          <td>{o.qty}</td>
                          <td>₹{o.limitPrice}</td>
                          <td><strong>₹{(o.qty * o.limitPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                          <td>PENDING</td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-warning"
                                onClick={() => openModifyModal(o)}
                              >
                                Modify
                              </button>

                              <button
                                className="btn btn-sm btn-danger"
                                onClick={async () => {
                                  if (!window.confirm('Cancel this pending order?')) return;
                                  try {
                                    const res = await axios.delete(
                                      `http://localhost:5000/cancel-order/${o._id}`,
                                      { data: { userId: user._id } }
                                    );
                                    alert(res.data.message || 'Order cancelled');
                                    // refresh orders
                                    const ordersRes = await axios.get(`http://localhost:5000/orders/${user._id}`);
                                    setOrders(ordersRes.data.orders);
                                    if (res.data && res.data.balance !== undefined) {
                                      setUser({ ...user, balance: res.data.balance });
                                    }
                                  } catch (err) {
                                    alert(err.response?.data?.error || 'Failed to cancel order');
                                  }
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}



          </div>
        </div>
      </div>

      {/* MODIFY ORDER MODAL */}
      {showModifyModal && selectedOrder && (
        <div
          className="modal d-block"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1000,
          }}
        >
          <div className="modal-dialog" style={{ marginTop: "10%" }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modify Order - {selectedOrder.symbol}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModifyModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={modifyQty}
                    onChange={(e) => setModifyQty(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price Type</label>
                  <div className="btn-group w-100" role="group">
                    <input
                      type="radio"
                      className="btn-check"
                      name="priceType"
                      id="limitOption"
                      value="limit"
                      checked={modifyPriceType === "limit"}
                      onChange={(e) => setModifyPriceType(e.target.value)}
                    />
                    <label className="btn btn-outline-primary" htmlFor="limitOption">
                      Limit Price
                    </label>
                    <input
                      type="radio"
                      className="btn-check"
                      name="priceType"
                      id="marketOption"
                      value="market"
                      checked={modifyPriceType === "market"}
                      onChange={(e) => setModifyPriceType(e.target.value)}
                    />
                    <label className="btn btn-outline-primary" htmlFor="marketOption">
                      Market Price
                    </label>
                  </div>
                </div>
                {modifyPriceType === "limit" && (
                  <div className="mb-3">
                    <label className="form-label">Limit Price (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={modifyPrice}
                      onChange={(e) => setModifyPrice(e.target.value)}
                      step="0.01"
                    />
                  </div>
                )}
                {modifyPriceType === "market" && (
                  <div className="mb-3">
                    <label className="form-label">Market Price (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={modifyMarketPrice}
                      readOnly
                      step="0.01"
                    />
                    {modifyMarketPrice ? (
                      <small className="text-muted">Read-only - Updated from live market</small>
                    ) : (
                      <small className="text-warning">Loading market price...</small>
                    )}
                  </div>
                )}

                {/* Balance and Approx Required */}
                {selectedOrder && (
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <div className="card bg-light">
                        <div className="card-body p-2">
                          <small className="text-muted">Available Balance</small>
                          <div className="fw-bold text-success">₹{user?.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card bg-light">
                        <div className="card-body p-2">
                          <small className="text-muted">Approx Required</small>
                          <div className="fw-bold text-primary">
                            ₹{(Number(modifyQty || 0) * Number(modifyPriceType === "limit" ? modifyPrice : modifyMarketPrice || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="alert alert-info">
                  <small>
                    Current: {selectedOrder?.qty} @ ₹{selectedOrder?.limitPrice}
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModifyModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleModifyOrder}
                  disabled={modifyLoading}
                >
                  {modifyLoading ? "Updating..." : "Update Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


