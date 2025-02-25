"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import InsuranceApi from "../components/api/InsuranceApi"
import axiosInstance from "../components/api/AuthApi"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
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

      const response = await InsuranceApi.get(url)

      if (response && (response.data.message === "User found" || response.data.message === "retrieved successfully")) {
        console.log("User details fetched:", response.data.data)
        setUserDetails(response.data.data)
        return response.data.data
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
      throw error
    }
  }, [])

  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post("/auth/authenticate", credentials)
      const { access_token, refresh_token, ...userData } = response.data.data

      setAccessToken(access_token)
      setRefreshToken(refresh_token)
      localStorage.setItem("refresh_token", refresh_token)

      const userInfo = {
        accessToken: access_token,
        ...userData,
      }
      setUser(userInfo)

      // Fetch additional user details after successful login
      const details = await fetchUserDetails(userData.userId, userData.role)

      return { ...userData, details }
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const logout = () => {
    setAccessToken(null)
    setRefreshToken(null)
    setUser(null)
    setUserDetails(null)
    localStorage.removeItem("refresh_token")
  }

  useEffect(() => {
    const initAuth = async () => {
      const storedRefreshToken = localStorage.getItem("refresh_token")
      if (storedRefreshToken) {
        setRefreshToken(storedRefreshToken)
        try {
          const response = await axiosInstance.post("/auth/refresh-token", { refreshToken: storedRefreshToken })
          const { access_token, user: userData } = response.data
          setAccessToken(access_token)
          setUser(userData)

          // Fetch user details if we have the user data
          if (userData?.userId && userData?.role) {
            await fetchUserDetails(userData.userId, userData.role)
          }
        } catch (error) {
          console.error("Failed to refresh token:", error)
          localStorage.removeItem("refresh_token")
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [fetchUserDetails])

  const refreshAccessToken = async () => {
    try {
      const response = await axiosInstance.post("/auth/refresh-token", { refreshToken })
      const { access_token } = response.data
      setAccessToken(access_token)
      return access_token
    } catch (error) {
      console.error("Failed to refresh access token:", error)
      logout()
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userDetails,
        setUser,
        accessToken,
        login,
        logout,
        loading,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default AuthContext

