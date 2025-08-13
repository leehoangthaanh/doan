import React from 'react'
import { Box, Paper, Typography, Grid } from '@mui/material'
import WelcomImg from '~/assets/welcome.jpg'

export default function AuthLayout({ title, children }) {
  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Bên trái - Form */}
      <Grid
        item
        xs={12}
        md={4}
        component={Paper}
        elevation={6}
        square
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          px: 4,
          bgcolor: '#34495e'
        }}
      >
        <Typography variant="h4" sx={{color: 'white', padding: '2rem'}}>
          {title}
        </Typography>
        {children}
      </Grid>

      {/* Bên phải - Trang trí */}
      <Grid
        item
        xs={false}
        md={8}
        sx={{
          backgroundImage: `url(${WelcomImg})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </Grid>
  )
}
