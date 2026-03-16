import { useContext, useState, useEffect } from "react";
import "../inpages-src/profile.css";
import { AuthContext } from "../Customhooks/AuthProvider";

const EMProfile = () => {
  const { user, loading } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    name: "",
    Number: "",
    age: "",
    address: "",
    dob: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        Number: user.Mobile || "",
        age: user.age || "",
        address: user.Address || "",
        dob: user.Date_of_birth || "",
      });
    }
  }, [user]);

  if (loading || !user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put(`/api/auth/update/${user._id}`, {
        name: formData.name,
        Mobile: formData.Number,
        age: formData.age,
        Address: formData.address,
        Date_of_birth: formData.dob,
      });
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      Number: user.Mobile || "",
      age: user.age || "",
      address: user.Address || "",
      dob: user.Date_of_birth || "",
    });
    setEditing(false);
  };

  return (
    <div className="Probody">
      <div className="Procon">
        {!editing && (
          <div className="proview">
            <div className="top-card">
              <div className="Profilepic">
                <img
                  src="/images/profile.jpg"
                  alt="User profile photo"
                  className="profile-img"
                  loading="lazy"
                />
              </div>
              <div className="Header-card">
                <div className="header-row name">Name: {user.name}</div>
                <div className="header-row email">Email: {user.email}</div>
                <div className="header-row mobile">
                  Mobile Number: {user.Mobile}
                </div>
                <div className="header-row role">Role: {user.role}</div>
              </div>
            </div>

            <div className="bottom-card">
              <div className="Profile-card">
                <h5>Personal Information</h5>
                <div className="profile-row age">Age: {user.age}</div>
                <div className="profile-row address">
                  Address: {user.Address}
                </div>
                <div className="profile-row dob">
                  Date of Birth: {user.Date_of_birth}
                </div>
              </div>

              <div className="Work-card">
                <h5>Work Information</h5>
                <div className="work-row role">Role: {user.role}</div>
                <div className="work-row salary">Salary: {user.salary}</div>
                <div className="work-row leave">
                  Leave Status: {user.leaveStatus}
                </div>
              </div>
            </div>
          </div>
        )}

        {!editing && (
          <button className="btnp" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        )}

        {editing && (
          <div className="Edicon">
            <div className="Ediview">
              {["name", "Number", "age", "address", "dob"].map((field) => (
                <div key={field} className="edit-field">
                  <label className="edit-label">
                    {field === "Number"
                      ? "Mobile Number"
                      : field === "dob"
                        ? "Date of Birth"
                        : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    className="input2"
                    type={
                      field === "age"
                        ? "number"
                        : field === "dob"
                          ? "date"
                          : "text"
                    }
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={
                      // ← add here
                      field === "name"
                        ? "Enter your name"
                        : field === "Number"
                          ? "Enter mobile number"
                          : field === "age"
                            ? "Enter age"
                            : field === "address"
                              ? "Enter address"
                              : field === "dob"
                                ? ""
                                : ""
                    }
                  />
                </div>
              ))}
            </div>

            <div className="btne">
              <button className="btnp" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </button>
              <button className="btnp" onClick={handleCancel} disabled={saving}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EMProfile;
