import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
// import { toast } from 'react-toastify'
import Login from '~/pages/Auth/Login'
import Register from '~/pages/Auth/Register'
import Board from '~/pages/Boards/_id'
import PrivateRoute from '~/components/PrivateRoute'

function App() {
  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === 'logout') {
        window.location.href = '/login' // reload tab khác về login
      }
    }

    window.addEventListener('storage', syncLogout)
    return () => window.removeEventListener('storage', syncLogout)
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/board"
        element={
          <PrivateRoute>
            <Board />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default App
