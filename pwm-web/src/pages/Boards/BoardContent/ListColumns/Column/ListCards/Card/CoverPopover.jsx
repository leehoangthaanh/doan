import React from 'react'
import { Popover, Typography, Grid, Box, Button } from '@mui/material'

const coverColors = [
  '#61BD4F', '#F2D600', '#FF9F1A', '#EB5A46',
  '#C377E0', '#0079BF', '#00C2E0', '#51E898',
  '#FF78CB', '#344563', '#B04632', '#4BBF6B'
]

export default function CoverPopover({ anchorEl, onClose, onColorSelect}) {
  const open = Boolean(anchorEl)

  const handleColorClick = (color) => {
    onColorSelect(color)
    onClose()
  }

//   const handleFileChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       onUploadImage(file) // gửi file thẳng ra ngoài
//     }
//     onClose()
//   }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{
        sx: { p: 2, width: 240 }
      }}
    >
      {/* Chọn màu */}
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Colors</Typography>
      <Grid container spacing={1} sx={{ mb: 2 }}>
        {coverColors.map((color, idx) => (
          <Grid item xs={3} key={idx}>
            <Box
              sx={{
                bgcolor: color,
                height: 30,
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 }
              }}
              onClick={() => handleColorClick(color)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Upload ảnh */}
      {/* <Typography variant="subtitle2" sx={{ mb: 1 }}>Attachments</Typography>
      <Button
        fullWidth
        variant="outlined"
        component="label"
        sx={{ textTransform: 'none' }}
      >
        Upload a cover image
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
      </Button>

      <Typography
        variant="caption"
        sx={{ mt: 1, display: 'block', color: 'text.secondary' }}
      >
        Tip: Drag an image onto the card to upload it.
      </Typography> */}
    </Popover>
  )
}
