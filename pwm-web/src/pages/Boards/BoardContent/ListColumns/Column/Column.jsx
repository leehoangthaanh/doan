import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Menu from '@mui/material/Menu'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Tooltip from '@mui/material/Tooltip'
import AddCardIcon from '@mui/icons-material/AddCard'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ListCards from './ListCards/ListCards'
import { mapOrder } from '~/utils/sorts'
import TextField from '@mui/material/TextField'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function Column({ column, deleteColumn, createNewCard, updateCard, deleteCard }) {
    const { attributes, listeners, setNodeRef, transform,transition, isDragging} = useSortable({
      id: column._id,
      data: { ...column }
    })

    const dndKitColumnStyles = {
      transform: CSS.Translate.toString(transform),
      transition,
      height: '100%',
      opacity: isDragging ? 0.5 : undefined
    }


    const [anchorEl, setAnchorEl] = React.useState(null)
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
    const [loading, setLoading] = useState(false)
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id') 

    const [openNewCardForm, setOpenNewCardForm] = useState(false)
    const toggleopenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)
  
    const [newCardTitle, setnewCardTitle] = useState('')
  
    const addNewCard = async () => {
      if(!newCardTitle) {
        toast.error('Please enter Card Title!', {position:'top-right'})
        return
      }

      const newCardData = {
        title: newCardTitle,
        columnId: column._id
      }

      await createNewCard(newCardData)
  
      toggleopenNewCardForm()
      setnewCardTitle('')
    }

    const handleOpenConfirmDelete = () => {
      setOpenConfirmDelete(true)
      handleClose()
    }
    const handleCloseConfirmDelete = () => setOpenConfirmDelete(false)

    const handleDelete = async () => {
      setLoading(true)
      try {
        if (typeof deleteColumn === 'function') {
          await deleteColumn(column._id)
        } 
        toast.success('Xoá cột thành công!')
        setOpenConfirmDelete(false)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Xoá thất bại!')
      } finally {
        setLoading(false)
      }
    }
    return (
      <div ref = {setNodeRef} style = {dndKitColumnStyles} {...attributes}>
        <Box {...listeners}
          sx ={{
            minWidth: '285px',
            maxWidth: '285px',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#dcdde1'),
            ml: 2,
            borderRadius: '12px',
            height: 'fit-content',
            maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
          }}
        >
          {/* Box Column Header */}
          <Box sx ={{
            height: (theme) => theme.trello.columnHeaderHeight,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography variant="h6" sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              {column.title}
            </Typography>
            <Tooltip>
              <ExpandMoreIcon sx ={{
                color: 'text.primary', cursor: 'pointer'}}
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                />
              </Tooltip>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              autoFocus={false}       
              slotProps={{
                list: {
                  'aria-labelledby': 'basic-button',
                },
              }}
            >
              <MenuItem onClick={handleOpenConfirmDelete}>
                <ListItemIcon>
                  <DeleteIcon color="error" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Xoá cột</ListItemText>
              </MenuItem>
            </Menu>

            <Dialog open={openConfirmDelete} onClose={handleCloseConfirmDelete} disableEscapeKeyDown={loading}>
              <DialogTitle>Bạn có chắc muốn xoá cột này không?</DialogTitle>
              <DialogActions>
                <Button onClick={handleCloseConfirmDelete} disabled={loading}>
                  Hủy
                </Button>
                <Button onClick={handleDelete} color="error" disabled={loading} autoFocus>
                  {loading ? 'Đang xoá...' : 'Xoá'}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
          
          {/* Box Column List Card */}
          <ListCards cards= {orderedCards} updateCard={updateCard} deleteCard={deleteCard}/>

          {/* Box Column Footer */}
          <Box sx ={{
            height: (theme) => theme.trello.columnFooterHeight,
            p: 2
          }}>
            {!openNewCardForm
              ? <Box sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
                }}>
                  <Button startIcon= {<AddCardIcon/>} onClick={toggleopenNewCardForm}>Thêm mới công việc</Button>
                  <Tooltip>
                    <DragHandleIcon sx ={{ cursor: 'pointer'}} />
                  </Tooltip>
                </Box>
              : <Box sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1
                }}>
                  <TextField
                  label="Nhập tên công việc mới"
                  type="text"
                  size="small"
                  variant="outlined"
                  autoFocus
                  value={newCardTitle}
                  onChange={(e) => setnewCardTitle(e.target.value)}
                  sx={{
                    '& label': {color: 'text.primary'},
                    '& input': {
                      color: (theme) => theme.palette.primary.main,
                      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                    },
                    '& label.Mui-focused:': { color: (theme) => theme.palette.primary.main },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {borderColor: (theme) => theme.palette.primary.main },
                      '&:hover fieldset': {borderColor: (theme) => theme.palette.primary.main },
                      '&.Mui-focused fieldset': {borderColor: (theme) => theme.palette.primary.main }
                    },
                    '&.MuiOutlinedInput-input': {
                      borderRadius: 1
                    }
                  }}
                  />
                  <Box sx={{ display:'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                    <Button
                    onClick={addNewCard}
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
                        color: (theme) => theme.palette.warning.light, 
                        cursor: 'pointer'
                      }}
                        onClick={toggleopenNewCardForm}
                    />
                  </Box>
                </Box>
            }
          </Box>
        </Box>
      </div>
  )
}

export default Column