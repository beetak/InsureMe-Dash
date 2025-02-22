"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { decodeToken } from "./tokenUtils"
import useAuth from "../../hooks/useAuth"
import axiosInstance from "../../components/api/AuthApi"

const backgroundImages = ["/images/travelbg.jpg", "/images/motorbg.jpg", "/images/healthbg.jpg"]

const AnimatedToast = ({ message, isVisible, type }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className={`absolute top-2 p-4 rounded-md shadow-md w-80 justify-center items-center flex ${
          type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white`}
      >
        {message}
      </motion.div>
    )}
  </AnimatePresence>
)

export default function LoginPage() {
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [domain, setDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [toastType, setToastType] = useState("success")

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const isEmail = (value) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    return emailRegex.test(value)
  }

  const showToastMessage = (message, type) => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!domain || !password) {
      showToastMessage("Please fill in all fields", "error")
      return
    }

    setLoading(true)
    try {
      if (!isEmail(domain)) {
        const response = await axiosInstance.post(`/auth/authenticate`, { email: domain, password })
        if (response?.data.code === "CREATED") {
          const { access_token, refresh_token, role, id, firstName, lastName } = response.data.data
          localStorage.setItem("refresh_token", refresh_token)
          localStorage.setItem("userNum", id)
          setUser({ accessToken: access_token, user: true, role, userId: id, firstname: firstName, surname: lastName })

          showToastMessage("Login successful", "success")

          const routes = {
            SUPER_ADMINISTRATOR: "/dashboard",
            ADMIN: "/dashboard",
            SALES_AGENT: "/sales",
            SHOP_SUPERVISOR: "/entities",
          }
          navigate(routes[role] || "/login")
        } else {
          showToastMessage(
            response.data.code === "UNAUTHORIZED" ? "Incorrect Email or Password" : "An error occurred",
            "error",
          )
        }
      } else {
        const response = await axiosInstance.post(`/insurer-users/login`, { email: domain, password })
        if (response?.data.code === "OK") {
          const accessToken = response.data.data
          const decodedToken = decodeToken(accessToken)

          if (decodedToken.active) {
            const { role, userId, firstName, lastName, companyId, companyName } = decodedToken
            setUser({
              accessToken,
              user: true,
              role,
              userId,
              firstname: firstName,
              surname: lastName,
              companyId,
              companyName,
            })

            showToastMessage("Login successful", "success")

            const routes = {
              INSURER_ADMIN: "/dashboard",
              MANAGER: "/dashboard",
              SALES_AGENT: "/sales",
            }
            navigate(routes[role] || "/login")
          }
        } else {
          showToastMessage(
            response.data.code === "UNAUTHORIZED" ? "Incorrect Email or Password" : "An error occurred",
            "error",
          )
        }
      }
    } catch (error) {
      console.error(error)
      showToastMessage("An error occurred. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Images */}
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: currentImageIndex === index ? 1 : 0,
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Login Container */}
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-lg backdrop-blur-md bg-white/10 p-8 shadow-xl border-white border-2"
          style={{ boxShadow: "0 4px 10px rgba(255, 255, 255, 0.5)" }}
        >
          <img src="images/icon.png" alt="Logo" className="w-20 mx-auto mb-6" />
          <h2 className="mb-6 text-center text-xl font-bold text-white">LOGIN</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Username or Email"
                className="w-full bg-transparent border-b-2 border-white/20 px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white transition-all duration-300"
              />
            </div>
            <div className="relative">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-transparent border-b-2 border-white/20 px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-white/50 hover:text-white"
              >
                <i className={`fas fa-eye${showPassword ? "-slash" : ""}`} />
              </button>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full rounded-xs bg-white py-2.5 font-medium text-gray-900 hover:bg-white/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>

          <div className="flex w-full justify-center">
            <AnimatedToast message={toastMessage} isVisible={showToast} type={toastType} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}