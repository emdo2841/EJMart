import axios from "axios";

const api = axios.create({
  baseURL: "https://ecoomerce-store-t40x.onrender.com/api", // Your Express API
  withCredentials: true, // Include cookies for session handling
});
// ✅ Axios request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios response interceptor
api.interceptors.response.use(
  (response) => response, // Return the response if successful
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 (unauthorized) and if it's the first attempt to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite loop

      // Get refresh token from local storage or cookies
      const refreshToken = localStorage.getItem("refreshToken"); // Or your method of storing the refresh token

      if (refreshToken) {
        try {
          // Attempt to refresh the token
          const res = await api.post("/auth/refresh-token", { refreshToken });

          // Successfully got new access token
          const { accessToken } = res.data;

          // Store new access token (you can store it in localStorage or cookies)
          localStorage.setItem("accessToken", accessToken);

          // Update the original request's authorization header with the new token
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

          // Retry the original request with the new token
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh token is invalid, redirect to login page
          console.error("Error refreshing token:", refreshError);
          window.location.href = "/login"; // Or any other route to handle login
        }
      } else {
        // If no refresh token available, redirect to login
        window.location.href = "/login"; // Or any other route to handle login
      }
    }

    // If error is not 401 or something else happened, reject the promise
    return Promise.reject(error);
  }
);

export default api;
