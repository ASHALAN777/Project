import React from "react";
import "../inpages-src/emmainboard.css";
import { useContext } from "react";
import { AuthContext } from "../Customhooks/AuthProvider";
import api from "../api/api";
import { toast } from "react-toastify";


import { useState, useEffect } from "react";

const EMMainboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    api
      .get("/api/auth/me")

      .then((res) => {
        setUserData(res.data);
        // console.log("data rom server :", res.data);
      })
      .catch((err) => {
        // console.error("Error fetching user data", err);
      });
  }, []);

  const [fromdate, setFromdate] = useState("");
  const [todate, setTodate] = useState("");
  const [leavereason, setLeavereason] = useState("");

  const handlesubmit = async (e) => {
    e.preventDefault();

    const leavedata = {
      leavefromdate: fromdate,
      leavetodate: todate,
      leavereason: leavereason,
    };
    const employeeuser = userData?.user || {};

    try {
      const res = await api.post(
        `/api/auth/leave/${employeeuser._id}/apply`,
        leavedata,
      );
      toast.success("Leave applied successfully!");
    } catch (error) {
      toast.error("Error: ...");
    }
  };

  const employeeuser = userData?.user || {};
  const leave = userData?.user?.leaves || [];

  const approvedCount = leave.filter((l) => l.status === "Approved").length;
  const pendingCount = leave.filter((l) => l.status === "Applied").length;
  const rejectedCount = leave.filter(
    (l) => l.status === "Rejected" || l.status === "Expired",
  ).length;
  return (
    <div className="bodyem">
      <div>
        <div className="Container1">
          <div className="Four1">
            <div className="Cardu1">
              Total Leave
              <div className="Numberu1">{leave.length}</div>
            </div>
            <div className="Cardu2">
              Approved Leave <div className="Numberu1">{approvedCount}</div>
            </div>
            <div className="Cardu3">
              Pending Leave <div className="Numberu1">{pendingCount}</div>
            </div>
            <div className="Cardu4">
              Rejected Leave <div className="Numberu1">{rejectedCount}</div>
            </div>{" "}
          </div>
        </div>
      </div>
      <div className="summavey1">
        <div className="emapplyleave1">
          <div className="dappa1">
            <h3>Apply for leave</h3>
            <div>
              <p>Leave reason</p>{" "}
              <input
                type="text"
                placeholder="type your reason here "
                value={leavereason}
                onChange={(e) => setLeavereason(e.target.value)}
              />
              <p>From</p>
              <input
                type="date"
                placeholder="dd/mm/yy"
                value={fromdate}
                onChange={(e) => setFromdate(e.target.value)}
              />
              <p>To</p>{" "}
              <input
                type="date"
                placeholder="dd/mm/yy "
                value={todate}
                onChange={(e) => setTodate(e.target.value)}
              />
            </div>
            <div>
              <button onClick={handlesubmit}>Apply</button>
            </div>
          </div>
        </div>
        <div className="emstatus">
          <h3> Leave status</h3>
          <table className="dappa2">
            <thead>
              <tr>
                <th>Noo</th>
                <th> Applied date</th>
                <th>Leave reason</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody className="lord">
              {leave.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {" "}
                      {new Date(item?.leavedate).toLocaleDateString("en-GB")}
                    </td>
                    <td>{item?.leavereason}</td>
                    <td>
                      {new Date(item?.leavefromdate).toLocaleDateString(
                        "en-GB",
                      )}{" "}
                      -{" "}
                      {new Date(item?.leavetodate).toLocaleDateString("en-GB")}
                    </td>
                    <td>{item?.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EMMainboard;
