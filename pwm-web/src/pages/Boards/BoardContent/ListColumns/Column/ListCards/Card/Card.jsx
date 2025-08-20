import React, { useState } from 'react'
import { toast } from 'react-toastify'
import {
  Card as MuiCard,
  Typography,
  CardContent,
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Button
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import EditCard from './EditCard'
import { PRIORITIES } from '~/utils/constanst'
import ListItemText from '@mui/material/ListItemText'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import ListItemIcon from '@mui/material/ListItemIcon'
import DeleteIcon from '@mui/icons-material/Delete'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const STATUS_COLORS = {
  'Chưa bắt đầu': '#d32f2f',
  'Đang làm': '#1976d2',
  'Chờ Review': '#e1b12c',
  'Hoàn thành': '#388e3c'
}

function Card({ card, updateCard, deleteCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        id: card._id,
        data: { ...card }
      })
  
  const dndKitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #ff6b6b' : undefined,
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const [loading, setLoading] = useState(false)
  const label = card.label

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const handleOpenConfirmDelete = () => {
    setOpenConfirmDelete(true)
    handleMenuClose()
  }
  const handleCloseConfirmDelete = () => setOpenConfirmDelete(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      if (typeof deleteCard === 'function') {
        await deleteCard(card._id)
      } 
      toast.success('Xoá dòng thành công!')
      setOpenConfirmDelete(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Xoá thất bại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <MuiCard
      ref = {setNodeRef} style = {dndKitCardStyles} {...attributes} {...listeners}
      sx={{
        position: 'relative',
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        display: card?.FE_PlaceholderCard ? 'none' : 'block',
        borderRadius: '12px',
        border: 0,
        flexShrink: 0,
        '&:hover': { borderColor: (theme) => theme.palette.primary.main },
        mb: 1
      }}
    >
      {card?.status && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: -32,
            backgroundColor: STATUS_COLORS[card.status] || '#1976d2',
            color: '#fff',
            px: 2,
            py: '4px',
            transform: 'rotate(45deg)',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            boxShadow: 2,
            pointerEvents: 'none'
          }}
        >
          {card.status}
        </Box>
      )}
      {card?.cover && (
        /^#([0-9A-F]{3}){1,2}$/i.test(card.cover) ? (
          <Box
            sx={{
              height: '40px',
              backgroundColor: card.cover
              // borderTopLeftRadius: '12px',
              // borderTopRightRadius: '12px'
            }}  
          />
        ) : (
          <CardMedia
            component="img"
            image={card.cover}
            alt="card cover"
            sx={{ maxHeight: 200, objectFit: 'cover' }}
          />
        )
      )}


      <CardContent sx={{ p: 1.5, pb: '8px !important' }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          {label?.name && (
            <Box
              sx={{
                mt: 1,
                px: 1,
                py: 0.25,
                backgroundColor: label.color,
                borderRadius: 2,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                boxShadow: 1,
                height: 20
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#fff' }}>
                🏷️ {label.name}
              </Typography>
            </Box>
          )}

          {PRIORITIES[card?.priority] && (
            <Box
              sx={{
                mt: 1,
                px: 1,
                py: 0.25,
                backgroundColor: PRIORITIES[card.priority].color,
                borderRadius: 2,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                boxShadow: 1,
                height: 20
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#fff' }}>
                🏷️ {PRIORITIES[card.priority].name}
              </Typography>
            </Box>
          )}
        </Box>

        <Box display="flex" alignItems="center" gap={0.5} flex={1} minWidth={0}>
          <IconButton size="small" onClick={handleMenuOpen} sx={{ p: '4px' }}>
            <EditIcon fontSize="small" />
          </IconButton>
          <Typography fontWeight="bold" noWrap>
            {card?.title}
          </Typography>
        </Box>

        <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              autoFocus={false}
              slotProps={{
                list: {
                  'aria-labelledby': 'basic-button',
                },
              }}
            >
              <MenuItem onClick={() => {
                setOpenEditDialog(true)  
                handleMenuClose()
              }}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Xem Chi Tiết</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleOpenConfirmDelete}>
                <ListItemIcon>
                  <DeleteIcon color="error" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Xoá</ListItemText>
              </MenuItem>
            </Menu>

            <Dialog open={openConfirmDelete} onClose={handleCloseConfirmDelete} disableEscapeKeyDown={loading}>
              <DialogTitle>Bạn có chắc muốn xoá dòng này không?</DialogTitle>
              <DialogActions>
                <Button onClick={handleCloseConfirmDelete} disabled={loading}>
                  Hủy
                </Button>
                <Button onClick={handleDelete} color="error" disabled={loading} autoFocus>
                  {loading ? 'Đang xoá...' : 'Xoá'}
                </Button>
              </DialogActions>
            </Dialog>

        <EditCard open={openEditDialog} onClose={() => setOpenEditDialog(false)} card={card} updateCard={updateCard} />

        {/* Dynamic fields */}
        {card?.description && (
          <Typography sx={{ mt: 1, textAlign: 'justify' }} variant="body2">
            {card.description}
          </Typography>
        )}

        {card?.dueDate && (
          <Typography sx={{ mt: 1 }} variant="body2">
            {new Date(card.dueDate).toLocaleDateString()}
          </Typography>
        )}
      </CardContent>
    </MuiCard>
  )
}

export default Card