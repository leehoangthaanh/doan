import React from 'react'
import {
  Box,
  Button,
  Typography,
  IconButton,
  Divider,
  Menu,
  MenuItem
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CloseIcon from '@mui/icons-material/Close'
import FilterListIcon from '@mui/icons-material/FilterList';
import DashboardIcon from '@mui/icons-material/Dashboard'
import ViewKanbanIcon from '@mui/icons-material/ViewKanban'
import TableChartIcon from '@mui/icons-material/TableChart'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import TimelineIcon from '@mui/icons-material/Timeline'

function Filter({currentView, setCurrentView}) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelectView = (view) => {
    setCurrentView(view)
    handleClose()
  }

  return (
    <Box>
      <Button
        sx={{ color: 'white' }}
        id="views-button"
        aria-controls={open ? 'views-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
      >
        <Typography variant="button">
          <FilterListIcon />
        </Typography>
      </Button>

      <Menu
        id="views-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: {
            width: 280,
            borderRadius: 3,
            p: 1,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2d2d2d' : '#dcdde1'),
            color: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'black')
          }
        }}
      >
        {/* Close button */}
        <Box display="flex" justifyContent="space-between" alignItems="center" px={1}>
          <Typography variant="subtitle1" fontWeight="bold">
            Views
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Premium section */}
        <Box
          sx={{
            backgroundColor: '#778beb',
            borderRadius: 2,
            p: 1.5,
            mt: 1,
            mb: 1
          }}
        >
          <Typography variant="caption" sx={{ color: '#0652DD', fontWeight: 'bold', fontSize: '0.875rem' }}>
            PREMIUM
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color:'#dfe4ea', fontWeight: 'bold' }}>  
            Xem công việc theo một cách mới
          </Typography>
          <Typography variant="caption" color="#dfe4ea">
            Chế độ xem chỉ khả dụng cho Không gian làm việc cao cấp.
          </Typography>
        </Box>

        {/* Views list */}
        <MenuItem 
          onClick={() => handleSelectView('board')} 
          selected={currentView === 'board'}
        >
          <ViewKanbanIcon sx={{ mr: 2, color: currentView === 'board' ? 'primary.main' : 'inherit' }} />
          Board
        </MenuItem>

        <MenuItem 
          onClick={() => handleSelectView('table')} 
          selected={currentView === 'table'}
        >
          <TableChartIcon sx={{ mr: 2, color: currentView === 'table' ? 'primary.main' : 'inherit' }} />
          Table
        </MenuItem>

        <MenuItem 
          onClick={() => handleSelectView('calendar')} 
          selected={currentView === 'calendar'}
        >
          <CalendarMonthIcon sx={{ mr: 2, color: currentView === 'calendar' ? 'primary.main' : 'inherit' }} />
          Calendar
        </MenuItem>

        <MenuItem 
          onClick={() => handleSelectView('dashboard')} 
          selected={currentView === 'dashboard'}
        >
          <DashboardIcon sx={{ mr: 2, color: currentView === 'dashboard' ? 'primary.main' : 'inherit' }} />
          Dashboard
        </MenuItem>

        {/* <MenuItem 
          onClick={() => handleSelectView('timeline')} 
          selected={currentView === 'timeline'}
        >
          <TimelineIcon sx={{ mr: 2, color: currentView === 'timeline' ? 'primary.main' : 'inherit' }} />
          Timeline
        </MenuItem> */}
      </Menu>
    </Box>
  )
}

export default Filter
