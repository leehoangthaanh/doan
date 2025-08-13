import React, { useState } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useTheme
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar, Pie, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const pieColors = [
  '#3498db',
  '#e67e22',
  '#2ecc71',
  '#9b59b6',
  '#f1c40f',
  '#e74c3c',
  '#1abc9c'
]

function ChartCard({ title, barData, pieData, lineData, barOptions, pieOptions }) {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState(null)
  const [chartType, setChartType] = useState('bar') // mặc định bar

  const openMenu = (e) => setAnchorEl(e.currentTarget)
  const closeMenu = () => setAnchorEl(null)

  const handleChangeChart = (type) => {
    setChartType(type)
    closeMenu()
  }

  const renderChart = () => {
    if (chartType === 'pie') {
      return (
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Pie data={pieData} options={pieOptions} />
        </Box>
      )
    }
    if (chartType === 'line') return <Line data={lineData} options={barOptions} />
    return <Bar data={barData} options={barOptions} />
  }

  return (
    <Paper sx={{ p: 2, bgcolor: theme.palette.background.paper }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{title}</Typography>
        <IconButton size="small" onClick={openMenu}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
          {['bar', 'pie', 'line'].map((type) => (
            <MenuItem
              key={type}
              onClick={() => handleChangeChart(type)}
              sx={{
                bgcolor: chartType === type ? theme.palette.action.selected : 'transparent'
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} chart
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <Box sx={{
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {renderChart()}
      </Box>
    </Paper>
  )
}

export default function DashboardView({ board }) {
  const theme = useTheme()

  // ==== Cards per list ====
  const listLabels = board?.columns?.map(col => col.title) || []
  const listCardCounts = board?.columns?.map(col => col.cards?.length || 0) || []

  const listBarData = {
    labels: listLabels,
    datasets: [
      {
        label: 'Cards',
        data: listCardCounts,
        backgroundColor: theme.palette.mode === 'dark' ? '#95a5a6' : '#3498db'
      }
    ]
  }

  const listLineData = {
    labels: listLabels,
    datasets: [
      {
        label: 'Cards',
        data: listCardCounts,
        borderColor: '#3498db',
        backgroundColor: '#3498db',
        fill: false,
        tension: 0.3
      }
    ]
  }

  const listPieData = {
    labels: listLabels,
    datasets: [
      {
        data: listCardCounts,
        backgroundColor: pieColors.slice(0, listLabels.length),
        borderColor: '#fff',
        borderWidth: 0
      }
    ]
  }

  // ==== Cards per due date category ====
  const allCards = board?.columns?.flatMap(col => col.cards || []) || []
  const now = new Date()
  const dueDateCounts = {
    Complete: allCards.filter(c => c.completed).length,
    'Due soon': allCards.filter(c =>
      c.dueDate && new Date(c.dueDate) > now &&
      (new Date(c.dueDate) - now) / (1000 * 60 * 60 * 24) <= 3
    ).length,
    'Due later': allCards.filter(c =>
      c.dueDate && new Date(c.dueDate) > now &&
      (new Date(c.dueDate) - now) / (1000 * 60 * 60 * 24) > 3
    ).length,
    Overdue: allCards.filter(c =>
      c.dueDate && new Date(c.dueDate) < now && !c.completed
    ).length,
    'No due date': allCards.filter(c => !c.dueDate).length
  }

  const dueBarData = {
    labels: Object.keys(dueDateCounts),
    datasets: [
      {
        label: 'Cards',
        data: Object.values(dueDateCounts),
        backgroundColor: [
          theme.palette.mode === 'dark' ? '#7f8c8d' : '#2ecc71',
          theme.palette.mode === 'dark' ? '#16a085' : '#f39c12',
          '#e67e22',
          theme.palette.mode === 'dark' ? '#c0392b' : '#e74c3c',
          theme.palette.mode === 'dark' ? '#34495e' : '#95a5a6'
        ]
      }
    ]
  }

  const dueLineData = {
    labels: Object.keys(dueDateCounts),
    datasets: [
      {
        label: 'Cards',
        data: Object.values(dueDateCounts),
        borderColor: '#e67e22',
        backgroundColor: '#e67e22',
        fill: false,
        tension: 0.3
      }
    ]
  }

  const duePieData = {
    labels: Object.keys(dueDateCounts),
    datasets: [
      {
        data: Object.values(dueDateCounts),
        backgroundColor: [
          '#2ecc71', '#f39c12', '#e67e22', '#e74c3c', '#95a5a6'
        ],
        borderColor: '#fff',
        borderWidth: 2
      }
    ]
  }

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        ticks: { color: theme.palette.text.primary, stepSize: 1 },
        grid: { color: theme.palette.divider }
      },
      x: {
        ticks: { color: theme.palette.text.primary },
        grid: { color: theme.palette.divider }
      }
    }
  }

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: theme.palette.text.primary }
      }
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Cards per list"
            barData={listBarData}
            pieData={listPieData}
            lineData={listLineData}
            barOptions={barOptions}
            pieOptions={pieOptions}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Cards per due date"
            barData={dueBarData}
            pieData={duePieData}
            lineData={dueLineData}
            barOptions={barOptions}
            pieOptions={pieOptions}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
