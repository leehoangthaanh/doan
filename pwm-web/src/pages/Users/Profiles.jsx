import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Typography,
} from '@mui/material'
import UserManagement from './UserManagement'
import UserInfo from './UserInfo'
import ChangePassword from './ChangePassword'

function Profile({ setCurrentView }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [isEditing, setIsEditing] = useState({
    fullName: false,
    birthDate: false,
    hometown: false,
    username: false,
  })

  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const handleOpenUserDialog = () => {
    setDialogOpen(true)
    handleMenuClose() // đóng menu trước khi hiện dialog
  }
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const handleOpenPasswordDialog = () => {
    setPasswordDialogOpen(true)
    handleMenuClose()
  }


  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    localStorage.setItem('logout', Date.now())
    toast.success('Đăng xuất')
    navigate('/login')
    window.location.href = '/login'
  }

  useEffect(() => {
    const data = localStorage.getItem('user')
    if (data) {
      setUserInfo(JSON.parse(data))
    }
  }, [])

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 2 }}>
        <Avatar sx={{ width: 32, height: 32, color: 'white' }}>
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="avatar"
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            user?.fullName?.charAt(0)?.toUpperCase() || '?'
          )}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 180,
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Xin chào {user?.fullName || 'Người dùng??'} @@
          </Typography>
          <Typography variant="body2" color="text.secondary">
            @{user?.username || '@username??'}
          </Typography>
        </Box>

        <Divider />
        {user?.role === 'admin' && (
          <MenuItem onClick={() => { setCurrentView('userManagement'); handleMenuClose() }}>
            Quản lý người dùng
          </MenuItem>
        )}
        <MenuItem onClick={handleOpenUserDialog}>Thông tin cá nhân</MenuItem>
        <MenuItem onClick={handleOpenPasswordDialog}>Đổi mật khẩu</MenuItem>
        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
      </Menu>

      <UserInfo
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />

      <ChangePassword
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
      />
    </Box>
  )
}

export default Profile
