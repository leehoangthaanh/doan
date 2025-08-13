import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { updateUserAPI } from '~/apis/index'

function UserInfo({ open, onClose, userInfo, setUserInfo }) {
  const [editedUserInfo, setEditedUserInfo] = useState({})

  useEffect(() => {
    if (open && userInfo) {
      setEditedUserInfo(userInfo)
    }
  }, [open, userInfo])

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleClose = () => {
    onClose()
  }

  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    try {
      setLoading(true)

      const user = JSON.parse(localStorage.getItem('user'))
      const token = localStorage.getItem('accessToken')
      const userId = user._id || user.id

      if (!user || !userId || !token) {
        alert('Thiếu thông tin người dùng hoặc token!')
        setLoading(false)
        return
      }

      const updatedData = {
        fullName: editedUserInfo.fullName,
        birthDate: editedUserInfo.birthDate,
        hometown: editedUserInfo.hometown,
      }

      await new Promise(resolve => setTimeout(resolve, 500))

      const result = await updateUserAPI(userId, updatedData, token)

      setUserInfo(result.user)
      localStorage.setItem('user', JSON.stringify(result.user))

      toast.success('Cập nhật thông tin người dùng thành công')
      onClose()
    } catch (err) {
      console.error('Update failed:', err)
      toast.error('Cập nhật thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const fieldLabels = {
    fullName: 'Họ tên',
    birthDate: 'Ngày sinh',
    hometown: 'Quê quán',
  }

  if (!userInfo) return null

  return (
    <Dialog
      open={open} 
      onClose={onClose} 
      maxWidth= {false}
      PaperProps={{
        sx: {
          width: '40%',
          maxWidth: 'none'
        }
      }}
     >
      <DialogTitle
        sx={{
          fontWeight: 'bold',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          color: 'white',
        }}
      >
        Thông tin cá nhân
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#f5f5f5'),
        }}
      >
        <Grid container spacing={2}>
          {Object.keys(fieldLabels).map((field) => (
            <Grid item xs={12} key={field}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? '#3e4a5a' : '#ffffff',
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography
                    sx={{
                      width: 120,
                      fontWeight: 500,
                      color: (theme) => theme.palette.text.primary,
                    }}
                  >
                    {fieldLabels[field]}
                  </Typography>
                  <TextField
                    name={field}
                    value={editedUserInfo[field] || ''}
                    onChange={handleChange}
                    size="small"
                    variant="outlined"
                    sx={{ width: '70%' }}
                    disabled={false}  // Bỏ disable để luôn có thể chỉnh sửa
                    InputProps={{
                      sx: (theme) => ({
                        height: 36,
                        borderRadius: 2,
                        fontSize: 14,
                        bgcolor:
                          theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
                        color: theme.palette.text.primary,
                      }),
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#f0f0f0'),
        }}
      >
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Đóng
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={loading}
          sx={{
            bgcolor: (theme) => theme.palette.success.main,
            color: '#fff',
            '&:hover': {
              bgcolor: (theme) => theme.palette.success.dark,
            },
          }}
        >
          {loading ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserInfo
