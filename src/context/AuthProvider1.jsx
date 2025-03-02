import { createContext, useContext, useState, useEffect, useCallback } from "react"
import axiosInstance from "../components/api/AuthApi"
import { decodeToken } from "../pages/login/tokenUtils"
import { useColors } from "./ColorProvider"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tokenRefreshInProgress, setTokenRefreshInProgress] = useState(false)
  const colorContext = useColors()

  // Centralized token management
  const getAccessToken = useCallback(() => localStorage.getItem("access_token"), [])
  const getRefreshToken = useCallback(() => localStorage.getItem("refresh_token"), [])

  const setTokens = useCallback((accessToken, refreshToken = null) => {
    if (accessToken) {
      localStorage.setItem("access_token", accessToken)
      axiosInstance.defaults.headers["Authorization"] = `Bearer ${accessToken}`
    } else {
      localStorage.removeItem("access_token")
      delete axiosInstance.defaults.headers["Authorization"]
    }

    if (refreshToken !== null) {
      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken)
      } else {
        localStorage.removeItem("refresh_token")
      }
    }
  }, [])

  const fetchUserDetails = useCallback(async (userId, role) => {
    try {
      const isInternalUser = [
        "INSURER_ADMIN",
        "IT_ADMIN",
        "PRODUCT_MANAGER",
        "IT_SUPPORT",
        "MANAGER",
        "TREASURY_ACCOUNTANT",
      ].includes(role)

      const url = isInternalUser ? `/insurer-users/user/${userId}` : `/users/userId/${userId}`

      const response = await axiosInstance.get(url)

      if (response?.data.message === "User found" || response?.data.message === "retrieved successfully") {
        setUserDetails(response.data.data)
        return response.data.data
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
      return null
    }
  }, [])

  // Improved token refresh logic with mutex to prevent multiple refresh attempts
  const refreshAccessToken = useCallback(async () => {
    if (tokenRefreshInProgress) return null

    try {
      setTokenRefreshInProgress(true)
      const refreshToken = getRefreshToken()

      if (!refreshToken) {
        throw new Error("No refresh token available")
      }

      const response = await axiosInstance.post("/auth/refresh-token", { refreshToken })

      if (response?.data?.data?.access_token) {
        const newAccessToken = response.data.data.access_token
        const newRefreshToken = response.data.data.refresh_token || refreshToken

        setTokens(newAccessToken, newRefreshToken)
        return newAccessToken
      } else {
        throw new Error("Invalid refresh token response")
      }
    } catch (error) {
      console.error("Token refresh failed:", error)
      // Clear tokens on refresh failure
      setTokens(null, null)
      setUser(null)
      setUserDetails(null)
      return null
    } finally {
      setTokenRefreshInProgress(false)
    }
  }, [tokenRefreshInProgress, getRefreshToken, setTokens])

  const verifyToken = useCallback(async () => {
    try {
      const accessToken = getAccessToken()
      console.log("Verifying token:", accessToken ? "Token exists" : "No token found")

      if (!accessToken) return null

      // For insurer users (no refresh token)
      if (!getRefreshToken()) {
        console.log("Insurer user detected (no refresh token)")
        const decodedToken = decodeToken(accessToken)
        console.log("Decoded token:", decodedToken)

        if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
          return decodedToken
        }
        console.log("Token expired or invalid")
        return null
      }

      // For regular users
      console.log("Regular user detected (has refresh token)")
      try {
        // Try to use the token first
        const decodedToken = decodeToken(accessToken)
        if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
          return decodedToken
        }

        // If token is expired, try to refresh it
        const newToken = await refreshAccessToken()
        if (newToken) {
          return decodeToken(newToken)
        }
        return null
      } catch (error) {
        console.log("Server token verification failed:", error.message)
        return null
      }
    } catch (error) {
      console.error("Token verification failed:", error)
      return null
    }
  }, [getAccessToken, getRefreshToken, refreshAccessToken])

  const logout = useCallback(() => {
    console.log("Logout called - Clearing auth state")
    // Check if we actually have tokens before logging out
    const hasTokens = getAccessToken() || getRefreshToken()
    if (!hasTokens) {
      console.log("No tokens found, skipping logout")
      return false
    }

    // Clear tokens
    setTokens(null, null)
    localStorage.removeItem("userNum")
    setUser(null)
    setUserDetails(null)

    // Clear color context data
    if (colorContext) {
      console.log("Clearing color context data", colorContext.companyDetails)
      colorContext.setCompanyDetails(null)
      colorContext.updateColors(null)
    }

    console.log("Logout completed")
    return true
  }, [getAccessToken, getRefreshToken, setTokens, colorContext])

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const accessToken = getAccessToken()
        console.log("Init auth - Access token:", accessToken ? "exists" : "not found")

        if (!accessToken) {
          setLoading(false)
          return
        }

        // Set the access token in axios headers
        axiosInstance.defaults.headers["Authorization"] = `Bearer ${accessToken}`

        // Verify the token
        const userData = await verifyToken()
        console.log("User data after verification:", userData)

        if (userData) {
          setUser(userData)
          // Fetch user details if we have user data
          if (userData) {
            // if (userData.userId && userData.role) {
            // await fetchUserDetails(userData.userId, userData.role)
            await fetchUserDetails(1007, "ADMIN")
          }
        } else {
          console.log("Token verification failed, logging out")
          logout()
        }
      } catch (error) {
        console.error("Auth initialization failed:", error)
        // Only logout if token verification explicitly failed
        if (error.response?.status === 401) {
          console.log("Unauthorized, logging out")
          logout()
        }
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [fetchUserDetails, logout, verifyToken, getAccessToken])

  // Set up axios interceptor for token refresh
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        // Only try to refresh if we get a 401 and haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry && getRefreshToken()) {
          originalRequest._retry = true

          try {
            const newAccessToken = await refreshAccessToken()

            if (newAccessToken) {
              // Retry the original request with the new token
              originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`
              return axiosInstance(originalRequest)
            } else {
              throw new Error("Token refresh failed")
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError)
            logout()
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      },
    )

    // Clean up interceptor on unmount
    return () => {
      axiosInstance.interceptors.response.eject(interceptor)
    }
  }, [refreshAccessToken, getRefreshToken, logout])

  const login = useCallback(
    async (email, password) => {
      console.log("Logging in with:", email)
      try {
        const isEmail = (value) => {
          const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
          return emailRegex.test(value)
        }

        // Try insurer login first if it's an email
        if (isEmail(email)) {
          try {
            const response = await axiosInstance.post("/insurer-users/login", {
              email,
              password,
            })

            if (response?.data.code === "OK") {
              const accessToken = response.data.data
              const decodedToken = decodeToken(accessToken)

              if (decodedToken.active) {
                const { role, userId, firstName, lastName, companyId, companyName } = decodedToken

                setTokens(accessToken)

                const userInfo = {
                  accessToken,
                  user: true,
                  role,
                  userId,
                  firstname: firstName,
                  surname: lastName,
                  companyId,
                  companyName,
                }

                setUser(userInfo)
                await fetchUserDetails(userId, role)
                return {
                  success: true,
                  data: userInfo,
                  route: ["INSURER_ADMIN", "MANAGER", "IT_SUPPORT", "PRODUCT_MANAGER", "TREASURY_ACCOUNTANT"].includes(
                    role,
                  )
                    ? "/dashboard"
                    : "/login",
                }
              }
            }
          } catch (error) {
            console.log("Insurer login failed, trying regular auth")
          }
        }

        const response = await axiosInstance.post("/auth/authenticate", {
          email,
          password,
        })

        if (response?.data.code === "CREATED") {
          const { access_token, refresh_token, role, id, firstName, lastName } = response.data.data

          setTokens(access_token, refresh_token)
          localStorage.setItem("userNum", id)

          const userInfo = {
            accessToken: access_token,
            user: true,
            role,
            userId: id,
            firstname: firstName,
            surname: lastName,
          }

          setUser(userInfo)
          await fetchUserDetails(id, role)
          return {
            success: true,
            data: userInfo,
            route:
              {
                SUPER_ADMINISTRATOR: "/dashboard",
                ADMIN: "/dashboard",
                SALES_AGENT: "/sales",
                SHOP_SUPERVISOR: "/entities",
              }[role] || "/login",
          }
        }

        return {
          success: false,
          error: "Invalid credentials",
        }
      } catch (error) {
        console.error("Login failed:", error)
        return {
          success: false,
          error: error.response?.data?.message || "An error occurred during login",
        }
      }
    },
    [fetchUserDetails, setTokens],
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        userDetails,
        loading,
        login,
        logout,
        refreshToken: refreshAccessToken, // Expose refresh token function
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default AuthContext

