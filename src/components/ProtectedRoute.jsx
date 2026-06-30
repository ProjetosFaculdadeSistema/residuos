import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import Navbar from './Navbar'

function ProtectedRoute() {
  const { isAuthenticated } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default ProtectedRoute
