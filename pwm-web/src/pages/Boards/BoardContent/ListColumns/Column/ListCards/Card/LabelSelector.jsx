import React, { useState } from 'react'
import { Menu, MenuItem, Button, TextField, Box } from '@mui/material'

function LabelSelector({ setLabel, children }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [labelName, setLabelName] = useState('')
  const [labelColor, setLabelColor] = useState('#1976d2') // màu mặc định

  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget)
    setLabelName('')
    setLabelColor('#1976d2')
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelect = () => {
    if (!labelName.trim()) return // không cho chọn nếu chưa nhập tên

    // Gọi setLabel với đối tượng {name, color}
    setLabel({ name: labelName.trim(), color: labelColor })
    handleClose()
  }

  return (
    <>
      <div onClick={handleOpen} style={{ display: 'inline-block' }}>
        {children}
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ p: 2, minWidth: 250 }}
      >
        <Box sx={{ px: 2, py: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Tên nhãn"
            size="small"
            value={labelName}
            onChange={(e) => setLabelName(e.target.value)}
            autoFocus
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <input
              type="color"
              value={labelColor}
              onChange={(e) => setLabelColor(e.target.value)}
              style={{
                width: 40,
                height: 32,
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                backgroundColor: 'transparent'
              }}
            />
            <span>{labelColor}</span>
          </Box>
          <Button
            variant="contained"
            onClick={handleSelect}
            disabled={!labelName.trim()}
          >
            Chọn nhãn
          </Button>
        </Box>
      </Menu>
    </>
  )
}

export default LabelSelector
