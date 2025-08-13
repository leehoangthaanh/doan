import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '~/pages/Auth/Login'
import Register from '~/pages/Auth/Register'
import Board from '~/pages/Boards/_id'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/board" element={<Board />} />
    </Routes>
  )
}

export default App
