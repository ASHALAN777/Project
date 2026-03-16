import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext({
  user: null,
  loading: true,
  Login: (userData) => {},
});

function AuthProvider({ children }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/auth/me`, {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const Login = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, Login }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
