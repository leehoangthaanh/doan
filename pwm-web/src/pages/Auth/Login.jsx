import React, { useState } from 'react'
import { TextField, Button, Box } from '@mui/material'
import AuthLayout from './AuthLayout'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { loginAPI } from '~/apis/index'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const { token, user } = await loginAPI({ username, password })
      localStorage.setItem('accessToken', token)
      localStorage.setItem('user', JSON.stringify(user))
      toast.success('Đăng nhập thành công')
      navigate('/board')
    } catch (error) {
      const msg = error.response?.data?.message || 'Đăng nhập thất bại!!'
      toast.error(msg)
    }
  }

  const handleNavigateToRegister = () => {
    navigate('/register')
  }

  return (
    <AuthLayout title="Đăng nhập">
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          width: '100%',
          maxWidth: 300,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <TextField
          fullWidth
          label="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          InputLabelProps={{ sx: { color: 'white', '&.Mui-focused': { color: 'white' } } }}
          InputProps={{
            sx: {
              height: 48,
              borderRadius: 2,
              bgcolor: 'transparent',
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }
            }
          }}
        />

        <TextField
          fullWidth
          label="Mật khẩu"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{ sx: { color: 'white', '&.Mui-focused': { color: 'white' } } }}
          InputProps={{
            sx: {
              height: 48,
              borderRadius: 2,
              bgcolor: 'transparent',
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }
            }
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            borderRadius: 2,
            py: 1.5,
            mt: 1,
            textTransform: 'none',
            fontWeight: 'bold',
            bgcolor: '#00a8ff',
            '&:hover': { bgcolor: '#ED4C67' }
          }}
        >
          Đăng nhập
        </Button>

        <Button
          type="button"
          onClick={handleNavigateToRegister}
          variant="contained"
          fullWidth
          sx={{
            borderRadius: 2,
            py: 1.5,
            mt: 1,
            textTransform: 'none',
            fontWeight: 'bold',
            bgcolor: '#009432',
            '&:hover': { bgcolor: '#ED4C67' }
          }}
        >
          Đăng ký
        </Button>
      </Box>
    </AuthLayout>
  )
}
