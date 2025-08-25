import React from 'react'
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'

function formatRemainingTime(dueDate) {
  const now = new Date()
  const due = new Date(dueDate)
  const diffMs = due - now

  if (diffMs <= 0) return 'đã hết hạn'

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (diffDays > 0) {
    return `sau ${diffDays} ngày${diffHours > 0 ? ` ${diffHours} giờ` : ''}`
  } else if (diffHours > 0) {
    return `sau ${diffHours} giờ`
  } else {
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    return `sau ${diffMinutes} phút`
  }
}

function Notification({ board }) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleOpen = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const now = new Date()
  const threeDays = 3 * 24 * 60 * 60 * 1000

  // Lấy toàn bộ card trong các column, lọc card có dueDate < 3 ngày
  const upcomingCards = board?.columns?.flatMap(col => col.cards || [])
    .filter(card => {
      if (!card?.dueDate) return false
      const due = new Date(card.dueDate)
      return due > now && (due - now) <= threeDays
    }) || []

  return (
    <Box>
      <IconButton onClick={handleOpen} sx={{ color: 'white' }}>
        <Badge badgeContent={upcomingCards.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 300,
            borderRadius: 3,
            p: 1,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2d2d2d' : '#f5f6fa'),
            color: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'black')
          }
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" sx={{ px: 1, pb: 1 }}>
          Thông báo
        </Typography>
        {upcomingCards.length > 0 ? (
          upcomingCards.map(card => (
            <MenuItem key={card._id} sx={{ whiteSpace: 'normal', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {card.title}
                </Typography>
                <Typography variant="subtitle2" sx={{color: 'error.main', fontWeight: 'bold'}}>
                    Hết hạn {formatRemainingTime(card.dueDate)}
                </Typography>
              </Box>
            </MenuItem>
          ))
        ) : (
          <MenuItem>Không có thẻ nào sắp hết hạn</MenuItem>
        )}
      </Menu>
    </Box>
  )
}

export default Notification
