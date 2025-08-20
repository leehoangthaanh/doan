import React from 'react'
import Profile from '~/pages/Users/Profiles'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import Filter from '~/components/AppBar/Menu/Filter'



const Menu_Style = {
  color: 'white',
  bgcolor:'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover' : {
    bgcolor: 'primary.50'
  }
}



function BoardBar({ board, currentView, setCurrentView }) {
  return (
    <Box px ={2} sx ={{
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        paddingX: 2,
        overflowX: 'auto',
        borderBottom : '1px solid white',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
      }}>
        <Box sx={{display:'flex', alignItems:'center', gap: 2}}>
          <Tooltip>
            <Chip
              sx = {Menu_Style}
              icon={<DashboardIcon />}
              label= {board?.title || 'Chưa có công việc'} 
              clickable 
            />
          </Tooltip>
          <Filter currentView={currentView} setCurrentView={setCurrentView} />
        </Box>
        <Profile />
      </Box>
  )
}

export default BoardBar
