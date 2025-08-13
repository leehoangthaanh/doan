import React, { useState } from 'react'
import { TextField, Button, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AuthLayout from '~/pages/Auth/AuthLayout'
import { toast } from 'react-toastify'

export default function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    birthDate: '',
    hometown: '',
    username: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      toast.error('Xác nhận mật khẩu không khớp')
      return
    }

    try {
      await axios.post('http://localhost:8088/v1/user/register', form)
      toast.success('Đăng ký thành công')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại')
    }
  }

  const handleGoBackToLogin = () => {
    navigate('/login')
  }

  const textFieldProps = {
    fullWidth: true,
    variant: 'outlined',
    InputLabelProps: {
      sx: {
        color: 'white',
        '&.Mui-focused': { color: 'white' }
      }
    },
    InputProps: {
      sx: {
        height: 48,
        borderRadius: 2,
        bgcolor: 'transparent',
        color: 'white',
        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
      }
    }
  }

  return (
    <AuthLayout title="Đăng ký tài khoản">
      <Box
        component="form"
        onSubmit={handleRegister}
        sx={{
          width: '100%',
          maxWidth: 350,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <TextField
          label="Họ tên"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          {...textFieldProps}
        />

        <TextField
          label="Ngày sinh"
          name="birthDate"
          type="date"
          value={form.birthDate}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          InputLabelProps={{
            shrink: true,
            sx: {
              color: 'white',
              '&.Mui-focused': { color: 'white' }
            }
          }}
          InputProps={{
            sx: {
              py: 1.2,
              borderRadius: 2,
              bgcolor: 'transparent',
              color: 'white',
              pr: 1,
              '& input': {
                color: 'white',
                padding: '0 12px'
              },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }
            }
          }}
        />

        <TextField
          label="Quê quán"
          name="hometown"
          value={form.hometown}
          onChange={handleChange}
          {...textFieldProps}
        />
        <TextField
          label="Tài khoản"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
          {...textFieldProps}
          InputLabelProps={{
            ...textFieldProps.InputLabelProps,
            sx: {
              ...textFieldProps.InputLabelProps.sx,
              '& .MuiFormLabel-asterisk': { color: 'red' }
            }
          }}
        />
        <TextField
          label="Mật khẩu"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          {...textFieldProps}
          InputLabelProps={{
            ...textFieldProps.InputLabelProps,
            sx: {
              ...textFieldProps.InputLabelProps.sx,
              '& .MuiFormLabel-asterisk': { color: 'red' }
            }
          }}
        />
        <TextField
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          {...textFieldProps}
          InputLabelProps={{
            ...textFieldProps.InputLabelProps,
            sx: {
              ...textFieldProps.InputLabelProps.sx,
              '& .MuiFormLabel-asterisk': { color: 'red' }
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
            bgcolor: '#009432',
            '&:hover': { bgcolor: '#ED4C67' }
          }}
        >
          Đăng ký
        </Button>

        <Button
          onClick={handleGoBackToLogin}
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
          Quay lại Đăng nhập
        </Button>
      </Box>
    </AuthLayout>
  )
}
