import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Customhooks/AuthProvider";

export default function RoleRedirect() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login");
    } else if (user.role === "Admin") {
      navigate("/admin");
    } else {
      navigate("/employee");
    }
  }, [user, loading, navigate]);
  

  return null;
}
