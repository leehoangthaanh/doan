import React from 'react'
import { Menu, MenuItem, Chip } from '@mui/material'
import { PRIORITIES } from '~/utils/constanst'


function PrioritySelector({ setPriority, children }) {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelect = (key) => {
    setPriority(key)
    handleClose()
  }

  return (
    <>
      <div onClick={handleOpen}>
        {children}
      </div>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {Object.entries(PRIORITIES).map(([key, { name, color }]) => (
          <MenuItem key={key} onClick={() => handleSelect(key)}>
            <Chip
              label={name}
              size="small"
              sx={{
                backgroundColor: color,
                color: '#fff',
                fontWeight: 500
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default PrioritySelector
