import React, { useMemo } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Box } from '@mui/material'

const localizer = momentLocalizer(moment)

function CalendarView({ events = [] }) {
  const calendarEvents = useMemo(() => {
    return events.map(ev => ({
        id: ev.id,
        title: ev.title,
        start: ev.start instanceof Date ? ev.start : new Date(ev.start || ev.date),
        end: ev.end instanceof Date ? ev.end : new Date(ev.end || ev.date),
        allDay: false
    }))
  }, [events])

  return (
    <Box
        sx={{
            height: (theme) => theme.trello?.boardContentHeight || '80vh',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2d2d2d' : 'white'),
            color: (theme) => (theme.palette.mode === 'dark' ? 'white' : 'black'),
            p: 4,
            '& .rbc-calendar': { height: '90%' },

            // Toolbar
            '& .rbc-toolbar': { color: 'inherit', fontSize: '1rem', fontWeight: 700 },
            '& .rbc-toolbar-label': {fontSize: '1.4rem'},
            '& .rbc-toolbar button': {
                fontSize: '0.725',
                fontWeight: 600,
                color: 'inherit',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'transparent',
                '&:hover': { background: 'rgba(255,255,255,0.1)' }
            },

            // Header ngày
            '& .rbc-header': { color: 'inherit', fontWeight: 600, fontSize: '0.875rem' },

            // Số ngày
            '& .rbc-date-cell': { color: 'inherit' },

            '& .rbc-button-link': {fontSize: '1rem'},

            // Ngày hiện tại
            '& .rbc-today': {
                backgroundColor: '#ff6b6b',
                color: 'white',
                fontWeight: 700,
                border: (theme) => `1px solid ${theme.palette.primary.main}`,
                boxSizing: 'border-box'
            },

            '& .rbc-off-range-bg': {
                backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#576574' : '#f0f0f0',
                color: (theme) =>
                    theme.palette.mode === 'dark' ? '#fff' : '#000',
                fontWeight: 700,
                height: '100%',
                width: '100%',
                margin: 0,
                padding: 0
            },

            // Sự kiện
            '& .rbc-event': {
                backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#3498db' : '#1565c0',
                color: 'white',
                borderRadius: 6,
                fontWeight: 600,
                fontSize: '0.875rem',
                padding: '3px 12px',
                width: 'fit-content',
                minWidth: 'unset',
                maxWidth: 'unset',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 auto'
            }
        }}
    >
      <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            defaultView="month"
            views={['month', 'week', 'day', 'agenda']}
            popup
            style={{ height: '100%' }}
      />
    </Box>
  )
}

export default CalendarView
