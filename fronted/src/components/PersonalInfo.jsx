import React from "react";
import { useOutletContext } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaUniversity,
  FaMoneyBill,
  FaVenusMars,
  FaIdBadge,
  FaHeart,
} from "react-icons/fa";

const PersonalInfo = () => {
  // ✅ Access user data from Profile.jsx via Outlet context
  const { user } = useOutletContext();

  if (!user) {
    return <p className="text-center mt-5">Loading user data...</p>;
  }

  const infoItems = [
    { icon: <FaUser />, label: "Full Name", value: user.fullname },
    { icon: <FaIdBadge />, label: "Username", value: user.username },
    { icon: <FaPhone />, label: "Phone No", value: user.phone_no },
    { icon: <FaEnvelope />, label: "Email", value: user.email },
    { icon: <FaBirthdayCake />, label: "Date of Birth", value: user.dob },
    { icon: <FaIdBadge />, label: "Demat ID", value: user._id },
    { icon: <FaMoneyBill />, label: "Income", value: user.income ? `₹${user.income}` : "—" },
    { icon: <FaVenusMars />, label: "Gender", value: user.gender },
    { icon: <FaHeart />, label: "Marital Status", value: user.marital_status },
  ];

  return (
    <div className="profile-main">
      <div className="profile-card" style={{ maxWidth: 900, margin: "0 auto" }}>
        <h3 className="section-title text-center">Personal Information</h3>

        <div className="row g-4 mt-3">
          {infoItems.map((item, index) => (
            <div key={index} className="col-md-6">
              <div
                className="d-flex align-items-center p-3 rounded-4"
                style={{
                  background: "var(--accent)",
                  border: "1px solid rgba(13,110,253,0.06)",
                  transition: "transform 0.18s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <div
                  className="me-3 d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "#fff",
                    width: "45px",
                    height: "45px",
                    fontSize: "1.1rem",
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="mb-1 text-secondary" style={{ fontSize: "0.9rem", fontWeight: "500" }}>
                    {item.label}
                  </p>
                  <p className="fw-semibold text-dark" style={{ fontSize: "1rem", marginBottom: 0 }}>
                    {item.value || "—"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
