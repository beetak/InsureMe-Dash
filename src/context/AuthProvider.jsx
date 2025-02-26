"use client"

import { createContext, useContext, useState, useEffect, useCallback, useNavigate } from "react"
import axiosInstance from "../components/api/AuthApi"
import { decodeToken } from "../pages/login/tokenUtils"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const [loading, setLoading] = useState(true)

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

  const verifyToken = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("access_token")
      console.log("Verifying token:", accessToken ? "Token exists" : "No token found")

      if (!accessToken) return null

      // For insurer users (no refresh token)
      if (!localStorage.getItem("refresh_token")) {
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
        const response = await axiosInstance.post("/auth/refresh-token")
        console.log("Token verification response:", response.data)
        return response.data
      } catch (error) {
        console.log("Server token verification failed:", error.message)
        // Try decoding token as fallback
        const decodedToken = decodeToken(accessToken)
        if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
          return decodedToken
        }
        return null
      }
    } catch (error) {
      console.error("Token verification failed:", error)
      return null
    }
  }, [])

  const logout = useCallback(() => {
    console.log("Logout called - Clearing auth state")
    // Check if we actually have tokens before logging out
    const hasTokens = localStorage.getItem("access_token") || localStorage.getItem("refresh_token")
    if (!hasTokens) {
      console.log("No tokens found, skipping logout")
      return false
    }

    // localStorage.removeItem("access_token")
    // localStorage.removeItem("refresh_token")
    // localStorage.removeItem("userNum")
    setUser(null)
    setUserDetails(null)
    delete axiosInstance.defaults.headers["Authorization"]
    console.log("Logout completed")
    return true
  }, [])

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const accessToken = localStorage.getItem("access_token")
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
          // if (userData.userId && userData.role) {
            // await fetchUserDetails(userData.userId, userData.role)
            await fetchUserDetails(1007, "ADMIN")
          // }
        } else {
          console.log("Token verification failed, checking token expiration")
          // Only logout if token is actually expired
          const decodedToken = decodeToken(accessToken)
          if (!decodedToken || decodedToken.exp * 1000 <= Date.now()) {
            console.log("Token expired, logging out")
            logout()
          } else {
            console.log("Token still valid, maintaining session")
            setUser(decodedToken)
            if (decodedToken.userId && decodedToken.role) {
              await fetchUserDetails(decodedToken.userId, decodedToken.role)
            }
          }
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
  }, [fetchUserDetails, logout, verifyToken])

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

                localStorage.setItem("access_token", accessToken)
                axiosInstance.defaults.headers["Authorization"] = `Bearer ${accessToken}`

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
                await fetchUserDetails(userId, role) // Add this line
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

          localStorage.setItem("access_token", access_token)
          localStorage.setItem("refresh_token", refresh_token)
          localStorage.setItem("userNum", id)

          axiosInstance.defaults.headers["Authorization"] = `Bearer ${access_token}`

          const userInfo = {
            accessToken: access_token,
            user: true,
            role,
            userId: id,
            firstname: firstName,
            surname: lastName,
          }

          setUser(userInfo)
          await fetchUserDetails(id, role) // Add this line
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
    [fetchUserDetails],
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        userDetails,
        loading,
        login,
        logout,
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