import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Reports() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [overallPL, setOverallPL] = useState(0);
  const [symbolPL, setSymbolPL] = useState({});

  useEffect(() => {
    if (!user?._id) return;
    axios.get(`http://localhost:5000/orders/${user._id}`)
      .then(res => setOrders(res.data.orders || []));
  }, [user]);

  useEffect(() => {
    if (!fromDate || !toDate) {
      setFilteredOrders([]);
      setOverallPL(0);
      setSymbolPL({});
      return;
    }
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const trades = orders.filter(o => {
      const d = new Date(o.date);
      return d >= from && d <= to && o.status === "COMPLETED";
    });
    setFilteredOrders(trades);

    // FIFO realized P&L calculation per sell trade
    const buyQueues = {};
    let totalPL = 0;
    const symbolPL = {};
    // Sort trades by date ascending
    const sorted = [...orders].filter(o => o.status === "COMPLETED").sort((a, b) => new Date(a.date) - new Date(b.date));
    sorted.forEach(o => {
      if (!buyQueues[o.symbol]) buyQueues[o.symbol] = [];
      if (o.side === "BUY") {
        buyQueues[o.symbol].push({ qty: o.qty, price: o.tradedPrice });
      } else if (o.side === "SELL") {
        let qtyToSell = o.qty;
        let realized = 0;
        while (qtyToSell > 0 && buyQueues[o.symbol].length > 0) {
          const lot = buyQueues[o.symbol][0];
          const usedQty = Math.min(lot.qty, qtyToSell);
          realized += usedQty * (o.tradedPrice - lot.price);
          lot.qty -= usedQty;
          qtyToSell -= usedQty;
          if (lot.qty === 0) buyQueues[o.symbol].shift();
        }
        // Only count P&L for sells in the selected range
        const d = new Date(o.date);
        if (d >= from && d <= to) {
          totalPL += realized;
          symbolPL[o.symbol] = (symbolPL[o.symbol] || 0) + realized;
        }
      }
    });
    setOverallPL(totalPL);
    setSymbolPL(symbolPL);
  }, [fromDate, toDate, orders]);

  return (
    <div className="container py-4">
      <h3 className="mb-4">Profit & Loss Report</h3>
      <div className="card p-3 mb-4">
        <div className="row align-items-end">
          <div className="col-md-4">
            <label className="form-label">From</label>
            <input type="date" className="form-control" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label">To</label>
            <input type="date" className="form-control" value={toDate} onChange={e => setToDate(e.target.value)} />
          </div>
        </div>
      </div>
      {fromDate && toDate && (
        <div className="mb-4">
          <div className="card p-3 text-center">
            <div className="fw-bold">Overall Profit & Loss</div>
            <div className={overallPL >= 0 ? "text-success" : "text-danger"}>
              ₹{overallPL.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      )}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Date</th>
              <th>Symbol</th>
              <th>Side</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amount</th>
              <th>Stock P&L</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr><td colSpan="7" className="text-center">No trades in selected range.</td></tr>
            ) : filteredOrders.map(o => (
              <tr key={o._id}>
                <td>{new Date(o.date).toLocaleDateString()}</td>
                <td>{o.symbol}</td>
                <td>{o.side}</td>
                <td>{o.qty}</td>
                <td>₹{o.tradedPrice}</td>
                <td className={o.side === "SELL" ? "text-success" : ""}>
                  {o.side === "SELL"
                    ? `+₹${(o.qty * o.tradedPrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                    : `₹${(o.qty * o.tradedPrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                </td>
                <td className={o.side === "SELL" && symbolPL[o.symbol] >= 0 ? "text-success" : o.side === "SELL" ? "text-danger" : ""}>
                  {o.side === "SELL"
                    ? `₹${(symbolPL[o.symbol] || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                    : "₹0.00"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
