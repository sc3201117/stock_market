import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function IPOPage() {
  const [ipoData, setIPOData] = useState({
    active: [],
    upcoming: [],
    listed: [],
    closed: [],
  });

  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("active");

  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    fetchIPO();
  }, []);

  const fetchIPO = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/ipo/qqq`);

      const mapIPO = (item) => ({
        ...item,
        company: item.name || "N/A",
        price_band:
          item.min_price != null && item.max_price != null
            ? `${item.min_price} - ${item.max_price}`
            : "N/A",
        lot_size: item.lot_size ?? "N/A",
        open_date: item.bidding_start_date || "N/A",
        close_date: item.bidding_end_date || "N/A",
      });

      setIPOData({
        active: (data.active || []).map(mapIPO),
        upcoming: (data.upcoming || []).map(mapIPO),
        listed: (data.listed || []).map(mapIPO),
        closed: (data.closed || []).map(mapIPO),
      });
    } catch (error) {
      console.error("Error fetching IPO:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: "active", label: "Active", color: "success" },
    { key: "upcoming", label: "Upcoming", color: "info" },
    { key: "listed", label: "Listed", color: "primary" },
    { key: "closed", label: "Closed", color: "danger" },
  ];

  const CountBadge = ({ count, variant }) => (
    <span className={`badge bg-${variant} text-white ms-2`} style={{ fontWeight: 600 }}>
      {count}
    </span>
  );

  // ⭐⭐⭐ MODERN CARD WITH CIRCLE LOGO ⭐⭐⭐
  const ModernCard = ({ ipo, type }) => (
    <div className="modern-card p-3 mb-4">
      {/* TOP ROW */}
      <div className="d-flex justify-content-between align-items-start">
        {/* LEFT SIDE — CIRCLE LOGO + COMPANY INFO */}
        <div className="d-flex align-items-start">
          <div className="me-3">
            <div className="circle-logo">
              {ipo.company ? ipo.company[0].toUpperCase() : "I"}
            </div>
          </div>

          <div>
            <h5 className="mb-1 fw-bold">{ipo.company}</h5>
            <p className="mb-1 text-muted small">{ipo.additional_text}</p>

            <div className="d-flex gap-2 mt-2">
              <span className="pill">{ipo.symbol}</span>

              {type === "active" && <span className="status-badge bg-success">Active</span>}
              {type === "upcoming" && <span className="status-badge bg-info">Upcoming</span>}
              {type === "listed" && <span className="status-badge bg-primary">Listed</span>}
              {type === "closed" && <span className="status-badge bg-danger">Closed</span>}
            </div>
          </div>
        </div>

        {/* ❌ Right image removed */}
      </div>

      <hr className="my-3" />

      {/* DETAILS ROW */}
      <div className="row g-2 small">
        <div className="col-sm-6 col-md-4">
          <div className="muted-key">Price Band</div>
          <div className="muted-val">{ipo.price_band}</div>
        </div>

        <div className="col-sm-6 col-md-4">
          <div className="muted-key">Lot Size</div>
          <div className="muted-val">{ipo.lot_size}</div>
        </div>

        <div className="col-sm-6 col-md-4">
          <div className="muted-key">Min Price</div>
          <div className="muted-val">{ipo.min_price ?? "N/A"}</div>
        </div>

        <div className="col-sm-6 col-md-4">
          <div className="muted-key">Max Price</div>
          <div className="muted-val">{ipo.max_price ?? "N/A"}</div>
        </div>

        <div className="col-sm-6 col-md-4">
          <div className="muted-key">Bidding Start</div>
          <div className="muted-val">{ipo.open_date}</div>
        </div>

        <div className="col-sm-6 col-md-4">
          <div className="muted-key">Bidding End</div>
          <div className="muted-val">{ipo.close_date}</div>
        </div>

        {/* LISTED SPECIFIC */}
        {type === "listed" && (
          <>
            <div className="col-sm-6 col-md-4">
              <div className="muted-key">Listing Price</div>
              <div className="muted-val">{ipo.listing_price ?? "N/A"}</div>
            </div>

            <div className="col-sm-6 col-md-4">
              <div className="muted-key">Listing Gains</div>
              <div className="muted-val">
                {ipo.listing_gains != null
                  ? `${ipo.listing_gains.toFixed(2)}%`
                  : "N/A"}
              </div>
            </div>

            <div className="col-sm-6 col-md-4">
              <div className="muted-key">Issue Price</div>
              <div className="muted-val">{ipo.issue_price ?? "N/A"}</div>
            </div>
          </>
        )}

        {/* CLOSED SPECIFIC */}
        {type === "closed" && (
          <div className="col-12">
            <div className="muted-key">Listing Date</div>
            <div className="muted-val">{ipo.listing_date ?? "N/A"}</div>
          </div>
        )}
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted small">
          SME: <strong>{ipo.is_sme ? "Yes" : "No"}</strong>
        </div>

        <div>
          {ipo.document_url ? (
            <a
              href={ipo.document_url}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-sm btn-outline-primary"
            >
              Prospectus
            </a>
          ) : (
            <span className="text-muted small">No document</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="container py-4 mt-2">
        <h1 className="fw-bold">IPO Dashboard</h1>

        {/* TABS */}
        <div className="tab-row mb-4 mt-3">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`tab-btn ${selectedTab === t.key ? "active" : ""}`}
              onClick={() => setSelectedTab(t.key)}
            >
              {t.label}
              <CountBadge count={ipoData[t.key].length} variant={t.color} />
            </button>
          ))}
        </div>

        {/* CONTENT */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          ipoData[selectedTab].map((ipo, idx) => (
            <ModernCard key={idx} ipo={ipo} type={selectedTab} />
          ))
        )}
      </div>

      {/* CSS */}
      <style>{`
        .tab-row {
          display: flex;
          gap: 12px;
        }
        .tab-btn {
          background: #f3f4f6;
          border: none;
          padding: 10px 18px;
          border-radius: 10px;
          font-weight: 600;
        }
        .tab-btn.active {
          background: #2563eb;
          color: #fff;
        }

        .modern-card {
          background: #ffffff;
          border-radius: 14px;
          box-shadow: 0 4px 18px rgba(0,0,0,0.08);
        }

        .circle-logo {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          background: #2563eb;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: bold;
          box-shadow: 0 4px 16px rgba(37,99,235,0.3);
        }

        .pill {
          background: rgba(37,99,235,0.1);
          color: #2563eb;
          padding: 6px 12px;
          border-radius: 30px;
          font-weight: 600;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 30px;
          color: #fff;
          font-weight: 600;
        }

        .muted-key {
          color: #6b7280;
          font-size: .82rem;
        }
        .muted-val {
          color: #111827;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}





