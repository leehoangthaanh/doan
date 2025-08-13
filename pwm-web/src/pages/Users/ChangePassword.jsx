import React, { useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from '@mui/material'
import { toast } from 'react-toastify'
import { changePasswordAPI } from '~/apis'

function ChangePassword({ open, onClose }) {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      toast.error('Chưa đăng nhập!')
      return
    }

    try {
      setLoading(true)
      await changePasswordAPI(formData, token)
      toast.success('Đổi mật khẩu thành công!')
      onClose()
    } catch (err) {
      console.error(err)
      const message = err?.response?.data?.message || 'Đổi mật khẩu thất bại.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth= {false}
      // fullWidth
      PaperProps={{
        sx: {
          width: '30%',
          maxWidth: 'none'
        }
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 'bold',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          color: 'white'
        }}
      >
        Đổi mật khẩu
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#f5f5f5')
        }}
      >
        <TextField
          label="Mật khẩu hiện tại"
          name="oldPassword"
          type="password"
          fullWidth
          size="small"
          margin="normal"
          value={formData.oldPassword}
          onChange={handleChange}
          InputProps={{
            sx: (theme) => ({
              height: 40,
              borderRadius: 2,
              fontSize: 14,
              bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
              color: theme.palette.text.primary
            })
          }}
        />
        <TextField
          label="Mật khẩu mới"
          name="newPassword"
          type="password"
          fullWidth
          size="small"
          margin="normal"
          value={formData.newPassword}
          onChange={handleChange}
          InputProps={{
            sx: (theme) => ({
              height: 40,
              padding: '0 12px',
              lineHeight: '40px',
              borderRadius: 2,
              fontSize: 14,
              bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
              color: theme.palette.text.primary
            })
          }}
        />
        <TextField
          label="Xác nhận mật khẩu mới"
          name="confirmPassword"
          type="password"
          fullWidth
          size="small"
          margin="normal"
          value={formData.confirmPassword}
          onChange={handleChange}
          InputProps={{
            sx: (theme) => ({
              height: 40,
              borderRadius: 2,
              fontSize: 14,
              bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
              color: theme.palette.text.primary
            })
          }}
        />
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#f0f0f0')
        }}
      >
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: (theme) => theme.palette.success.main,
            color: '#fff',
            '&:hover': {
              bgcolor: (theme) => theme.palette.success.dark
            }
          }}
        >
          {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChangePassword
