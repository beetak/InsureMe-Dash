import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "https://insureme.co.zw:8082/api/v1",
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor is now handled in the AuthContext
// to centralize token refresh logic and avoid circular dependencies

export default axiosInstance

