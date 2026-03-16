import React, { useState, useEffect } from "react";
import "../inpages-src/Editor.css";
import Swal from "sweetalert2";
import api from "../api/api";

const API_URL = import.meta.env.VITE_API_URL;
/* ---------- SweetAlert setup ---------- */
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success",
    cancelButton: "btn btn-danger",
  },
  buttonsStyling: true,
});

/* ---------- APPROVE LEAVE ---------- */
const approvepop = async (user, setRefreshKey) => {
  if (!user?.leaves || user.leaves.length === 0) {
    await Swal.fire(
      "No Leave Found",
      "This employee has no active leave request.",
      "info",
    );
    return;
  }

  const latestLeave = user.leaves[user.leaves.length - 1];

  if (latestLeave.status !== "Applied") {
    await Swal.fire(
      "Already Processed",
      "This leave is already handled.",
      "warning",
    );
    return;
  }

  const result = await swalWithBootstrapButtons.fire({
    title: "Approve Leave?",
    html: `
    <p><strong>Reason:</strong>${latestLeave.leavereason || "No reason provided"}</p> <br>
    <p><strong>From:</strong>${latestLeave.leavefromdate ? new Date(latestLeave.leavefromdate).toLocaleDateString("en-GB") : "N/A"} - <strong>To:</strong>${latestLeave.leavetodate ? new Date(latestLeave.leavetodate).toLocaleDateString("en-GB") : "N/A"}</p> <br>
    
    <p>This action cannot be reverted.</p>
  `,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Approve",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  try {


   await api.patch(`/api/auth/leave/${user._id}`, {
  leaveId: latestLeave._id,
  status: "Approved",
});

    setRefreshKey((k) => k + 1);

    await Swal.fire("Approved!", "Leave has been approved.", "success");
  } catch (err) {
   
    await Swal.fire("Error", "Could not approve leave", "error");
  }
};

/* ---------- REJECT LEAVE ---------- */
const rejectpop = async (user, setRefreshKey) => {
  if (!user?.leaves || user.leaves.length === 0) return;

  const latestLeave = user.leaves[user.leaves.length - 1];

  if (latestLeave.status !== "Applied") return;

  const result = await swalWithBootstrapButtons.fire({
    title: "Reject Leave?",
    html: `
    <p><strong>Reason:</strong>${latestLeave.leavereason || "No reason provided"}</p> <br>
    <p><strong>From:</strong>${latestLeave.leavefromdate ? new Date(latestLeave.leavefromdate).toLocaleDateString("en-GB") : "N/A"} - <strong>To:</strong>${latestLeave.leavetodate ? new Date(latestLeave.leavetodate).toLocaleDateString("en-GB") : "N/A"}</p> <br>
    
    <p>This action cannot be reverted.</p>
  `,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Reject",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  try {
    await api.patch(`/api/auth/leave/${user._id}`, {
  leaveId: latestLeave._id,
  status: "Rejected",
});

    if (!res.ok) throw new Error("Reject failed");

    setRefreshKey((k) => k + 1);

    await Swal.fire("Rejected!", "Leave has been rejected.", "success");
  } catch (err) {
    // console.error(err);
    await Swal.fire("Error", "Could not reject leave", "error");
  }
};

/* ---------- MAIN COMPONENT ---------- */
const Editor = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  /* Auto-refresh every 1 minute (cron sync) */
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((k) => k + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  /* Fetch users */
  useEffect(() => {
    setLoading(true);

    fetch(`${API_URL}/api/auth/`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(setUsers)
      // .catch(console.error)
      .finally(() => setLoading(false));
  }, [refreshKey]);

  if (loading) return <p>Loading...</p>;

  const employeeUsers = users.filter((u) => u.role === "Employee");

  /* Leave column renderer */
  const LeaveUpdate = (user) => {
   
    if (!user.leaves || user.leaves.length === 0) {
      return <span>No Leave</span>;
    }

    const latestLeave = user.leaves[user.leaves.length - 1];

    if (latestLeave.status === "Applied") {
      return (
        <div className="btnap">
          <button onClick={() => approvepop(user, setRefreshKey)}>
            Approve
          </button>
          <button onClick={() => rejectpop(user, setRefreshKey)}>Reject</button>
        </div>
      );
    }

    return <span>{latestLeave.status}</span>;
  };

  return (
    <div className="Edibody">
      <div className="table-wrapper no-scrollbar">
        <table className="users-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Applied Date</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Leave</th>
            </tr>
          </thead>
          <tbody>
            {employeeUsers.map((user, index) => {
              const recentLeave =
                user.leaves && user.leaves.length > 0
                  ? user.leaves[user.leaves.length - 1]
                  : null;
              return (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {new Date(recentLeave?.leavedate).toLocaleDateString(
                      "en-GB",
                    )}
                  </td>
                  <td>
                    {new Date(recentLeave?.leavefromdate).toLocaleDateString(
                      "en-GB",
                    )}
                  </td>
                  <td>
                    {new Date(recentLeave?.leavetodate).toLocaleDateString(
                      "en-GB",
                    )}
                  </td>
                  <td>{LeaveUpdate(user)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Editor;
