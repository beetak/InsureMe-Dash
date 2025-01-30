import axios from "axios";

const InsuranceApi = axios.create({
  baseURL: "https://insureme.co.zw:8082/api/v1",
  // baseURL: "http://localhost:8083/api/v1",
});

function isTokenExpired(token) {
  if (!token) return true;
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
}

async function refreshAccessToken(refreshToken) {
  try {
    const response = await axios.post("https://insureme.co.zw:8082/api/v1/auth/refresh-token", { refreshToken });
    // const response = await axios.post("http://localhost:8083/api/v1/auth/refresh-token", { refreshToken });
    return response.data.accessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
}

export function setupInterceptors(getUser, setUser) {
  InsuranceApi.interceptors.request.use(
    async (config) => {
      const user = getUser();
      const refreshToken = localStorage.getItem('refresh_token');

      if (user.accessToken && !isTokenExpired(user.accessToken)) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
      } else if (refreshToken) {
        try {
          const newAccessToken = await refreshAccessToken(refreshToken);
          setUser((prevUser) => ({
            ...prevUser,
            accessToken: newAccessToken,
          }));
          config.headers.Authorization = `Bearer ${newAccessToken}`;
        } catch (error) {
          console.error("Error refreshing access token:", error);
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

export default InsuranceApi;

