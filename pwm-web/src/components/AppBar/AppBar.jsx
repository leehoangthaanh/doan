import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import { InputAdornment, TextField, Typography, Paper, CircularProgress } from '@mui/material'
import Filter from './Menu/Filter'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { fetchCardSearchAPI } from '~/apis/index'
import EditCard from '~/pages/Boards/BoardContent/ListColumns/Column/ListCards/Card/EditCard'




function AppBar({ updateCard, deleteCard }) {
  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)

  useEffect(() => {
    if (searchValue.trim() === '') {
      setSearchResults([])
      setLoading(false)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await fetchCardSearchAPI(searchValue)
        setSearchResults(data)
      } catch {
        setSearchResults([])
      }
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchValue])

  const handleSelectCard = (card) => {
    setSelectedCard(card)
    setOpenEditDialog(true)
    
    // Đóng dropdown sau khi render EditCard
    setTimeout(() => {
      setSearchValue('')
      setSearchResults([])
    }, 0)
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        paddingX: 2,
        paddingTop: '12px',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        position: 'relative', 
        zIndex: 1000
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <EventAvailableIcon sx={{ color: 'white' }} />
          <Typography variant="h6" sx={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'white' }}>
            Công việc cá nhân
          </Typography>
          {/* <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Filter />
          </Box> */}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative' }}>
          <TextField
            id="outlined-search"
            label="Tìm kiếm công việc"
            type="text"
            size="small"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'white' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <CloseIcon
                    fontSize="small"
                    sx={{ color: searchValue ? 'white' : 'transparent', cursor: 'pointer' }}
                    onClick={() => setSearchValue('')}
                  />
                </InputAdornment>
              )
            }}
            sx={{
              minWidth: '200px',
              '& label': { color: 'white' },
              '& input': { color: 'white' },
              '& label.Mui-focused': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' }
              }
            }}
          />
          <ModeSelect />

          {/* Dropdown kết quả tìm kiếm */}
          {searchValue.trim() !== '' && (
            <Box
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                width: '100%',
                mt: 1,
                maxHeight: 300,
                overflowY: 'auto',
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#fff'),
                borderRadius: 1,
                p: 1,
                boxShadow: 3
              }}
            >
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
              {!loading && searchResults.length === 0 && (
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 2 }}>
                  Không tìm thấy kết quả
                </Typography>
              )}
              {!loading &&
                searchResults.map((card) => (
                  <Paper
                    key={card._id}
                    sx={{
                      p: 1,
                      mb: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#f0f0f0')
                      }
                    }}
                    onClick={() => handleSelectCard(card)}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {card.title}
                    </Typography>
                    {card.label?.name && (
                      <Box
                        sx={{
                          backgroundColor: card.label.color,
                          borderRadius: 1,
                          color: '#fff',
                          display: 'inline-block',
                          px: 1,
                          py: 0.5,
                          mt: 0.5,
                          mb: 0.5,
                          fontSize: 12,
                          fontWeight: 500
                        }}
                      >
                        🏷️ {card.label.name}
                      </Box>
                    )}
                    <Typography variant="body2" noWrap sx={{ maxWidth: '90%' }}>
                      {card.description || '(Không có mô tả)'}
                    </Typography>
                  </Paper>
                ))}
            </Box>
          )}
        </Box>
      </Box>
      {/* Dialog EditCard */}
      {selectedCard && (
        <EditCard
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          card={selectedCard}
          updateCard={updateCard}
          deleteCard={deleteCard}
        />
      )}
    </Box>
  )
}

export default AppBar
