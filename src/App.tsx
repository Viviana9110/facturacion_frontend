import { Routes, Route } from "react-router-dom"
import Layout from "./pages/Layout"
import Dashboard from "./pages/Dashboard"
import FoodLog from "./pages/Clients"
import ActivityLog from "./pages/Products"
import Bill from "./pages/Bill"
import Login from "./pages/Login"

import { Toaster } from "react-hot-toast"
import ProtectedRoute from "./components/ProtectedRoute"

const App = () => {
  return (
    <>
      <Toaster />

      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas privadas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout/>
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="clientes" element={<FoodLog />} />
          <Route path="productos" element={<ActivityLog />} />
          <Route path="facturacion" element={<Bill />} />
        </Route>
      </Routes>
    </>
  )
}

export default App