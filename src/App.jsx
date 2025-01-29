import React, { useEffect, Suspense } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "./Layout"
import ProtectedRoute from "./ProtectedRoute"
import useAuth from "./hooks/useAuth"
import { useColors } from "./context/ColorProvider"
import { routes } from "./routes/routeConfig"

function App() {
  const { user } = useAuth()
  const { updateColors } = useColors()

  useEffect(() => {
    if (user) {
      updateColors(user)
    }
  }, [user]) // Added updateColors to dependencies

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {routes.map(({ path, element: Element, roles }) => (
            <Route
              key={path}
              path={path}
              element={
                roles.length > 0 ? (
                  <ProtectedRoute allowedRoles={roles}>
                    <Element />
                  </ProtectedRoute>
                ) : (
                  <Element />
                )
              }
            />
          ))}
          <Route index element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App

