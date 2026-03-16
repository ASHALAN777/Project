import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_URL}`,
  withCredentials: true, // sends cookies automatically
});

// ✅ REACTIVE interceptor — catches 401 and refreshes silently
api.interceptors.response.use(
  (response) => response, // success → just return it

  async (error) => {
    const originalReq = error.config;
    const message = error.response?.data?.message;

  
    if (
      error.response?.status === 401 &&
      (message === "ACCESS_TOKEN_EXPIRED" || message === "UNAUTHORIZED") &&
      !originalReq._retry &&
      !originalReq.url.includes("api/auth/refresh")
    ) {
      originalReq._retry = true;

      try {
        // Silently get new access token
        await axios.post(
          `${API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Retry original request — user stays on page, notices nothing!
        return api(originalReq);

      } catch (refreshError) {
        // Refresh token also expired → only NOW go to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // ✅ Not logged in at all → go to login
    if (
      error.response?.status === 401 &&
      message === "UNAUTHORIZED" &&
      !originalReq.url.includes("api/auth/me") &&
      !originalReq.url.includes("api/auth/login")
    ) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;