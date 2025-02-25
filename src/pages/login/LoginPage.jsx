"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const backgroundImages = ["/images/travelbg.jpg", "/images/motorbg.jpg", "/images/healthbg.jpg"]

const Toast = ({ message, isVisible, type }) => {
  if (!isVisible) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out 
      ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
      ${type === "success" ? "bg-green-500" : "bg-red-500"}
      text-white px-6 py-3 rounded-lg shadow-lg`}
    >
      {message}
    </div>
  )
}

export default function LoginPage() {
  const { login, logout } = useAuth()
  const navigate = useNavigate()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    message: "",
    visible: false,
    type: "success",
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === backgroundImages.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const showToastMessage = (message, type) => {
    setToast({ message, visible: true, type })
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }))
    }, 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      showToastMessage("Please fill in all fields", "error")
      return
    }

    setLoading(true)
    try {
      const result = await login(email, password)

      if (result.success) {
        showToastMessage("Login successful", "success")
        navigate(result.route)
      } else {
        showToastMessage(result.error, "error")
      }
    } catch (error) {
      showToastMessage("An error occurred. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  // If logged out, navigate to login
  useEffect(() => {
    const handleLogout = async () => {
      const loggedOut = await logout()
      if (loggedOut) {
        navigate("/login")
      }
    }

    handleLogout()
  }, [logout, navigate])

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Images */}
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out
            ${currentImageIndex === index ? "opacity-100" : "opacity-0"}`}
          style={{
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
        <div className="w-full max-w-md rounded-lg backdrop-blur-md bg-white/10 p-8 shadow-xl border-white/20 border-2">
          <img src="/images/icon.png" alt="Logo" className="w-32 mx-auto mb-6 bg-white py-2 px-4 rounded-full" />

          <h2 className="mb-6 text-center text-xl font-bold text-white">LOGIN</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Username or Email"
                className="w-full bg-transparent border-b-2 border-white/20 px-4 py-2 text-white 
                  placeholder-white/90 focus:outline-none focus:border-white transition-all duration-300"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-transparent border-b-2 border-white/20 px-4 py-2 text-white 
                  placeholder-white/90 focus:outline-none focus:border-white transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-white/50 hover:text-white"
              >
                <i className={`fas fa-eye${showPassword ? "-slash" : ""}`} />
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-white py-2.5 font-medium text-gray-900 
                hover:bg-white/90 transition-colors duration-300
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <Toast message={toast.message} isVisible={toast.visible} type={toast.type} />
        </div>
      </div>
    </div>
  )
}

