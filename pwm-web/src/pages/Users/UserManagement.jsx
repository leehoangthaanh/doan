// UserManagementView.jsx
import React, { useEffect, useState } from 'react'
import { getUsersAPI, deleteUserAPI, updateUserRoleAPI } from '~/apis/index'
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedUserId, setSelectedUserId] = useState(null)

  const handleRoleClick = (event, userId) => {
    setAnchorEl(event.currentTarget)
    setSelectedUserId(userId)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
    setSelectedUserId(null)
  }

  const handleChangeRole = async (role) => {
    try {
      await updateUserRoleAPI(selectedUserId, role)
      // cập nhật UI
      setUsers((prev) =>
        prev.map((user) =>
          user._id === selectedUserId ? { ...user, role } : user
        )
      )
    } catch (err) {
      alert(err.message || 'Cập nhật quyền thất bại')
    } finally {
      handleCloseMenu()
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getUsersAPI()
      setUsers(data)
    } catch (err) {
      setError(err.message || 'Lỗi khi tải danh sách người dùng')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return
    try {
      await deleteUserAPI(id)
      setUsers((prev) => prev.filter((user) => user._id !== id))
    } catch (err) {
      alert(err.message || 'Xóa người dùng thất bại')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const roles = ['User', 'Admin']
  return (
    <Box
      sx={{
        height: (theme) => theme.trello?.boardContentHeight || '80vh',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2d2d2d' : '#fff'),
        color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000'),
        p: 4,
        overflowY: 'auto',
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
        Quản lý người dùng
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#3a3a3a' : '#f5f5f5') }}>
              <TableRow>
                <TableCell><strong>Tên đăng nhập</strong></TableCell>
                <TableCell><strong>Họ tên</strong></TableCell>
                <TableCell><strong>Số cột</strong></TableCell>
                <TableCell><strong>Số công việc</strong></TableCell>
                <TableCell><strong>Quyền</strong></TableCell>
                <TableCell><strong>Xoá Người dùng</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.columnCount}</TableCell>
                    <TableCell>{user.cardCount}</TableCell>
                    <TableCell>
                      <Tooltip title="Nhấn để thay đổi quyền">
                        <Box
                          onClick={(e) => handleRoleClick(e, user._id)}
                          sx={{
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            color: 'primary.main',
                            display: 'inline-flex',
                            alignItems: 'center',
                            textTransform: 'capitalize',
                            userSelect: 'none',
                          }}
                        >
                          {user.role || 'user'}
                          <ArrowDropDownIcon fontSize="small" />
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDelete(user._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Không có người dùng nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {roles.map((role) => (
          <MenuItem
            key={role}
            onClick={() => handleChangeRole(role)}
            sx={{
              fontWeight:
                users.find((u) => u._id === selectedUserId)?.role === role
                  ? 'bold'
                  : 'normal',
              color:
                users.find((u) => u._id === selectedUserId)?.role === role
                  ? 'primary.main'
                  : 'inherit',
            }}
          >
            {role}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default UserManagement
