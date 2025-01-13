import axios from "axios";
import useAuth from "../../hooks/useAuth";

const instance = axios.create({
  baseURL: "http://localhost:8083/api/v1",
});

// Interceptor to handle token refreshing
instance.interceptors.request.use(
  async (config) => {
    const { accessToken, setAccessToken } = useAuth();
    const refreshToken = localStorage.getItem('refresh_token')

    // Check if the access token is available
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // If the access token is expired, try to refresh it
    if (!accessToken || isTokenExpired(accessToken)) {
      try {
        const newAccessToken = await refreshAccessToken(refreshToken);
        setAccessToken(newAccessToken);
        config.headers.Authorization = `Bearer ${newAccessToken}`;
      } catch (error) {
        // Handle token refresh failure
        console.error("Error refreshing access token:", error);
        // You may want to handle the error, like redirecting the user to the login page
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to check if the token is expired
function isTokenExpired(token) {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
}

// Helper function to refresh the access token
async function refreshAccessToken(refreshToken) {
  try {
    const response = await axios.post("/auth/refresh-token", {
      refreshToken,
    });
    return response.data.accessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
}

export default instance;