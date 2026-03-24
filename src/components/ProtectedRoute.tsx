import { Navigate } from "react-router-dom"
import { useAppContext } from "../context/AppContext"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isUserFetched } = useAppContext()

  if (!isUserFetched) return <p>Loading...</p>

  if (!user) return <Navigate to="/login" replace />

  return children
}

export default ProtectedRoute