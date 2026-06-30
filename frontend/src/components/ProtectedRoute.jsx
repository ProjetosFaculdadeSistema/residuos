import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

function ProtectedRoute() {
  const { isAuthenticated } = useSelector((state) => state.auth)
  const location = useLocation()
  const mainRef  = useRef(null)

  // Volta ao topo a cada troca de rota
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen bg-base-100">
      <Sidebar />
      <main ref={mainRef} className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default ProtectedRoute
