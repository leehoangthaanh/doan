import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'

import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'



function ListColumns({ columns, createNewColumn, deleteColumn, createNewCard, updateCard, deleteCard }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleopenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle, setnewColumnTitle] = useState('')

  const addNewColumn = async () => {
    if(!newColumnTitle) {
      toast.error('Please enter Column Title!')
      return
    }

    const newColumnData = {
      title: newColumnTitle
    }

    await createNewColumn(newColumnData)

    toggleopenNewColumnForm()
    setnewColumnTitle('')
  }

  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy} >
      <Box sx={{
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': { m: 2}
      }}>
          {columns.map(column => <Column key={column._id} 
            column={column}
            deleteColumn={deleteColumn}
            createNewCard={createNewCard} 
            updateCard={updateCard} 
            deleteCard={deleteCard}
          />)}

          {!openNewColumnForm
            ? <Box onClick={toggleopenNewColumnForm} sx ={{
              minWidth: '220px',
              maxWidth: '220px',
              mx: 2,
              borderRadius: '12px',
              height: 'fit-content',
              bgcolor: '#ffffff3d'
              }}>
                <Button
                startIcon= {<NoteAddIcon />}
                sx ={{
                  color: 'white',
                  width: '100%',
                  justifyContent: 'flex-start',
                  pl: 2.5,
                  py: 1
                }}>
                  Thêm mới cột
                </Button>
              </Box>
            : <Box sx={{
              minWidth: '230px',
              maxWidth: '230px',
              mx: 2,
              p: 1,
              borderRadius: '12px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              <TextField
              label="Nhập tên cột"
              type="text"
              size="small"
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setnewColumnTitle(e.target.value)}
              sx={{
                '& label': {color: 'white'},
                '& input': {color: 'white'},
                '& label.Mui-focused:': {color: 'white'},
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {borderColor: 'white'},
                  '&:hover fieldset': {borderColor: 'white'},
                  '&.Mui-focused fieldset': {borderColor: 'white'}
                }
              }}
              />
              <Box sx={{ display:'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                <Button
                onClick={addNewColumn}
                variant="contained" color="success" size="small"
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': {bgcolor: (theme) => theme.palette.success.main}
                }}
                >
                  Thêm
                </Button>
                <CloseIcon 
                  fontSize="small"
                  sx={{
                    color: 'white', 
                    cursor: 'pointer',
                    '&:hover': { color: (theme) => theme.palette.warning.light}
                  }}
                    onClick={toggleopenNewColumnForm}
                />
              </Box>
            </Box>
          }
          
      </Box>
    </SortableContext>
  )
}

export default ListColumns