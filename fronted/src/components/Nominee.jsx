import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";


const Nominee = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    number: "",
    age: "",
  });
  const [nominee, setNominee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // ✅ control edit mode

  // ✅ Fetch user's existing nominee when page loads
  useEffect(() => {
    const fetchNominee = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.length > 0) {
          setNominee(res.data[0]);
        }
      } catch (err) {
        console.error("Error fetching nominee:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };
    fetchNominee();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle save / update nominee
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dob || !formData.number || !formData.age) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setNominee(res.data.nominee);
      setIsEditing(false);
      alert("✅ Nominee saved successfully!");
    } catch (error) {
      console.error("Error saving nominee:", error.response?.data || error);
      alert(error.response?.data?.message || "Error saving nominee");
    }
  };

  // ✅ Toggle edit mode
  const handleEdit = () => {
    if (nominee) {
      setFormData({
        name: nominee.name,
        dob: nominee.dob ? nominee.dob.split("T")[0] : "",
        number: nominee.number,
        age: nominee.age,
      });
    }
    setIsEditing(true);
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="profile-main">
      <div className="profile-card" style={{ maxWidth: 700, margin: "40px auto", border: "1px solid rgba(13,110,253,0.06)" }}>
        <h3 className="section-title text-center">Nominee Information</h3>
        <hr />

      {/* ✅ Show saved nominee info */}
      {nominee && !isEditing ? (
        <div className="mt-4">
          <h5 className="text-success fw-bold text-center mb-3">
            ✅ Nominee details saved
          </h5>
          <div className="border rounded p-4 bg-light">
            <p>
              <strong>Name:</strong> {nominee.name}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {new Date(nominee.dob).toLocaleDateString()}
            </p>
            <p>
              <strong>Mobile Number:</strong> {nominee.number}
            </p>
            <p>
              <strong>Age:</strong> {nominee.age}
            </p>
          </div>

          <div className="text-center mt-4 d-flex justify-content-center gap-3">
            <button className="btn btn-warning px-4" onClick={handleEdit}>
              ✏️ Change Nominee
            </button>
          </div>
        </div>
      ) : (
        // ✅ Nominee form (for new or edit)
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="row gy-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold text-primary">
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Enter nominee's full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold text-primary">
                Date of Birth <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className="form-control"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold text-primary">
                Mobile Number <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="number"
                placeholder="Enter nominee's phone number"
                value={formData.number}
                onChange={handleChange}
                maxLength={10}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold text-primary">
                Age <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                name="age"
                placeholder="Enter age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="text-center mt-4 d-flex justify-content-center gap-3">
            <button type="submit" className="edit-btn px-4 py-2">
              {isEditing ? "Update Nominee" : "Save Nominee"}
            </button>

            {isEditing && (
              <button type="button" className="btn btn-outline-secondary px-4 py-2" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
    </div>
  );
};

export default Nominee;
