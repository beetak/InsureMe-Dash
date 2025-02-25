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

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Only try to refresh if we get a 401 and haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refresh_token")
        if (!refreshToken) {
          throw new Error("No refresh token available")
        }

        // Make sure we use the full URL for refresh token request
        const response = await axios.post("https://insureme.co.zw:8082/api/v1/auth/refresh-token", { refreshToken })

        if (response.data?.data?.access_token) {
          const newAccessToken = response.data.data.access_token

          // Update tokens
          localStorage.setItem("access_token", newAccessToken)

          // Update axios headers
          axiosInstance.defaults.headers["Authorization"] = `Bearer ${newAccessToken}`
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`

          // Retry the original request
          return axiosInstance(originalRequest)
        } else {
          throw new Error("Invalid refresh token response")
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError)
        // Only clear tokens if refresh actually failed
        // Don't redirect automatically - let the AuthProvider handle it
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance

