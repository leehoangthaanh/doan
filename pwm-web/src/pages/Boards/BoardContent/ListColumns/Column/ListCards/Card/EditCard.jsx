import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Button,
  IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LabelIcon from '@mui/icons-material/Label'
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import AttachFileIcon from '@mui/icons-material/AttachFile'
import AddIcon from '@mui/icons-material/Add'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import DueDateSelector from './DueDateSelector'
import CoverPopover from './CoverPopover'
import LabelSelector from './LabelSelector'
import PrioritySelector from './PrioritySelector'
import { LABELS } from '~/utils/constanst'
import { PRIORITIES } from '~/utils/constanst'

function EditCard({ open, onClose, card, updateCard }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [coverAnchorEl, setCoverAnchorEl] = useState(null)
  const [cover, setCover] = useState(null) 
// cover có thể là { type: 'color', value: '#ff0000' } hoặc { type: 'image', value: 'url_ảnh' }
  const [label, setLabel] = useState({ name: '', color: '' })
  const [dueDate, setDueDate] = useState(card.dueDate || null)
  const [priority, setPriority] = useState(card.priority || null)

  useEffect(() => {
    if (card) {
      setTitle(card.title || '')
      setDescription(card.description || '')
      setDueDate(card.dueDate || null)
      setLabel(card.label || '')
    }
  }, [card])

  const commonButtonStyle = {
    color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#000',
    border: '1px solid',
    borderColor: (theme) =>
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : theme.palette.grey[400],
    '&:hover': {
      borderColor: (theme) => theme.palette.mode === 'dark' ? '#aaa' : '#888'
    },
    minWidth: 130,
    justifyContent: 'flex-start',
    textTransform: 'none',
    px: 2,
    gap: 1.2,
    py: 1,
    fontSize: 14
  }


  const handleSave = async () => {
    const updateData = {
      title: title.trim(),
      description: description.trim(),
      ...(label ? { label } : {}),
      ...(dueDate ? { dueDate } : {}),
      ...(priority ? { priority } : {}),
      ...(cover ? { cover: cover.value } : {})
    }
    try {
      setLoading(true)
      // await updateCardAPI({ cardId: card._id, updateData })
      
      if (typeof updateCard === 'function') {
        updateCard({ cardId: card._id, updateData })
      }
      onClose()
      toast.success('Cập nhật thành công')
    } catch (error) {
      const msg = error.response?.data?.message || 'Cập nhật công việc thất bại!!'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }


  const handleTitleClick = () => setIsEditingTitle(true)
  const handleTitleChange = (e) => setTitle(e.target.value)
  const handleTitleBlur = () => setIsEditingTitle(false)
  const handleClose = () => onClose()

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          fontWeight: 'bold',
          bgcolor: (theme) => theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8
        }}
      >
        Chi tiết công việc
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          display: 'flex',
          gap: 2,
          bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2c3e50' : '#f5f5f5'
        }}
      >
        {/* Cột trái */}
        <Box sx={{ flex: 1 }}>
          {/* Tiêu đề */}
          {isEditingTitle ? (
            <TextField
              fullWidth
              autoFocus
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              variant="standard"
              inputProps={{
                style: {
                  fontSize: '1.75rem',
                  fontWeight: 500
                }
              }}
            />
          ) : (
            <Typography
              variant="h4"
              sx={{
                cursor: 'pointer',
                fontWeight: 500,
                mb: 2,
                '&:hover': {
                  opacity: 0.7,
                  textDecoration: 'underline', // gạch chân khi hover
                  color: (theme) => theme.palette.primary.main
                  }
              }}
              onClick={handleTitleClick}
            >
              {title || 'Tên thẻ'}
            </Typography>
          )}

          {/* Các nút hành động */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Button variant="outlined" startIcon={<AddIcon />}  onClick={(e) => setCoverAnchorEl(e.currentTarget)} sx={commonButtonStyle}>Thêm nền</Button>
            <DueDateSelector dueDate={dueDate} onChange={setDueDate}>
              <Button variant="outlined" startIcon={<AccessTimeIcon />} sx={commonButtonStyle}>Ngày</Button>
            </DueDateSelector>
            <LabelSelector setLabel={setLabel}>
              <Button variant="outlined" startIcon={<LabelIcon />} sx={commonButtonStyle}>Nhãn</Button>
            </LabelSelector>
            <PrioritySelector setPriority={setPriority}>
              <Button variant="outlined" startIcon={<LowPriorityIcon />} sx={commonButtonStyle}>Độ ưu tiên</Button>
            </PrioritySelector>
            <Button variant="outlined" startIcon={<AttachFileIcon />} sx={commonButtonStyle}>Đính kèm</Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            {cover && (
              <Box
                sx={{
                  mt: 2,
                  px: 1.5,
                  py: 0.75,
                  bgcolor: cover.type === 'color' ? cover.value : '#ee5253',
                  borderRadius: 2,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  boxShadow: 1
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: '#fff'
                  }}
                >
                  {cover.type === 'color' ? 'Màu' : 'Ảnh'}
                </Typography>
              </Box>
            )}

            {dueDate && dayjs(dueDate).isValid() && (
              <Box
                sx={{
                  mt: 2,
                  px: 1.5,
                  py: 0.75,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#7f8fa6' : '#dcdde1',
                  borderRadius: 2,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  boxShadow: 1
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  📅 {dayjs(dueDate).format('YYYY-MM-DD HH:mm')}
                </Typography>
              </Box>
            )}

            {label?.name && (
              <Box
                sx={{
                  mt: 2,
                  px: 1.5,
                  py: 0.75,
                  backgroundColor: label.color,
                  borderRadius: 2,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  boxShadow: 1
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#fff' }}>
                  🏷️ {label.name}
                </Typography>
              </Box>
            )}

            {PRIORITIES[priority] && (
              <Box
                sx={{
                  mt: 2,
                  px: 1.5,
                  py: 0.75,
                  backgroundColor: PRIORITIES[priority].color,
                  borderRadius: 2,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  boxShadow: 1
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#fff' }}>
                  🏷️ {PRIORITIES[priority].name}
                </Typography>
              </Box>
            )}
          </Box>

          <Typography variant="subtitle2" sx={{ mt: 3 }}>
            Mô tả
          </Typography>
          <TextField
            placeholder="Thêm mô tả chi tiết..."
            multiline
            fullWidth
            minRows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mt: 1 }}
            InputProps={{
              sx: (theme) => ({
                fontSize: 14,
                bgcolor: theme.palette.mode === 'dark' ? '#353b48' : '#fff',
                color: theme.palette.text.primary
              })
            }}
          />
        </Box>

        <Box sx={{ width: '20%' }}>
          {/* <Typography variant="subtitle1" fontWeight="bold">
            Bình luận & hoạt động
          </Typography>
          <TextField
            fullWidth
            placeholder="Viết bình luận..."
            sx={{ my: 1 }}
            InputProps={{
              sx: (theme) => ({
                fontSize: 14,
                bgcolor: theme.palette.mode === 'dark' ? '#353b48' : '#fff',
                color: theme.palette.text.primary
              })
            }}
          /> */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              <b>Thành</b> đã thêm thẻ này vào Today
            </Typography>
            <Typography variant="caption">03/08/2025 lúc 09:46 AM</Typography>
          </Box>
        </Box>
      </DialogContent>

      {/* Hành động */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#f0f0f0'),
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8
        }}
      >
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            bgcolor: (theme) => theme.palette.success.main,
            color: '#fff',
            '&:hover': {
              bgcolor: (theme) => theme.palette.success.dark
            }
          }}
        >
          {loading ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </DialogActions>
      <CoverPopover
        anchorEl={coverAnchorEl}
        onClose={() => setCoverAnchorEl(null)}
        onColorSelect={(color) => setCover({ type: 'color', value: color })}
      />
    </Dialog>
  )
}

export default EditCard