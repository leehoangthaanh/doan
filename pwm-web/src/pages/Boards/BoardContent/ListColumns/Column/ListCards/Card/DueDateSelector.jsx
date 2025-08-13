import React, { useState } from 'react'
import {
  Box,
  Button,
  Typography,
  Popover,
  TextField,
  MenuItem
} from '@mui/material'
import dayjs from 'dayjs'

function DueDateSelector({ dueDate, onChange, children }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedDate, setSelectedDate] = useState(
    dueDate ? dayjs(dueDate).format('YYYY-MM-DD') : ''
  )
  const [selectedTime, setSelectedTime] = useState(
    dueDate ? dayjs(dueDate).format('HH:mm') : ''
  )
  // const [reminder, setReminder] = useState('None')

  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSave = () => {
    const datetime = dayjs(`${selectedDate}T${selectedTime}`).toISOString()
    onChange(datetime)
    handleClose()
  }

  const handleRemove = () => {
    onChange(null)
    handleClose()
  }

  return (
    <>
      <span onClick={handleClick} style={{ display: 'inline-block' }}>
        {children}
      </span>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <Typography variant="h6" gutterBottom>
            Dates
          </Typography>

          <TextField
            fullWidth
            type="date"
            label="Due date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            sx={{ my: 1 }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            type="time"
            label="Time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />

          {/* <TextField
            fullWidth
            select
            label="Set due date reminder"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
          >
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="10min">10 minutes before</MenuItem>
            <MenuItem value="1hour">1 hour before</MenuItem>
            <MenuItem value="1day">1 day before</MenuItem>
          </TextField> */}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
            <Button color="error" onClick={handleRemove}>
              Remove
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  )
}

export default DueDateSelector
