import React from 'react'
import { Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Chip
} 
from '@mui/material'
import { PRIORITIES } from '~/utils/constanst'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import ScheduleIcon from '@mui/icons-material/Schedule'
import CancelIcon from '@mui/icons-material/Cancel'


// Hàm tính tiến độ
const getProgressStatus = (card) => {
    const dueDate = card.dueDate ? new Date(card.dueDate) : null
    const updatedAt = card.updatedAt ? new Date(card.updatedAt) : null
    const now = new Date()

    // ✅ Nếu không có hạn
    if (!dueDate) {
        return card.completed ? 'Hoàn thành' : 'Chưa hoàn thành'
    }

    // ✅ Nếu đã hoàn thành
    if (card.completed) {
        if (updatedAt && updatedAt <= dueDate) return 'Hoàn thành đúng hạn'
        if (updatedAt && updatedAt > dueDate) return 'Hoàn thành trễ hạn'
        return 'Hoàn thành'
    }

    // ✅ Nếu chưa hoàn thành
    if (now > dueDate) return 'Trễ hạn'
    return 'Chưa hoàn thành'
}

function TableView({ board }) {
    const renderProgressChip = (status) => {
        switch (status) {
            case 'Hoàn thành đúng hạn':
            return (
                <Chip
                icon={<CheckCircleIcon />}
                label={status}
                size="small"
                sx={{ backgroundColor: '#4caf50', color: 'white', fontWeight: 'bold' }}
                />
            )
            case 'Hoàn thành trễ hạn':
            return (
                <Chip
                icon={<ErrorIcon />}
                label={status}
                size="small"
                sx={{ backgroundColor: '#fbc531', color: 'white', fontWeight: 'bold' }}
                />
            )
            case 'Hoàn thành':
            return (
                <Chip
                icon={<CheckCircleIcon />}
                label={status}
                size="small"
                sx={{ backgroundColor: '#4caf50', color: 'white', fontWeight: 'bold' }}
                />
            )
            case 'Trễ hạn':
            return (
                <Chip
                icon={<CancelIcon />}
                label={status}
                size="small"
                sx={{ backgroundColor: '#d32f2f', color: 'white', fontWeight: 'bold' }}
                />
            )
            case 'Chưa hoàn thành':
            return (
                <Chip
                icon={<ScheduleIcon />}
                label={status}
                size="small"
                sx={{ backgroundColor: '#ff9800', color: 'white', fontWeight: 'bold' }}
                />
            )
        }
    }
    const rows = board?.columns?.flatMap(column =>
        column.cards.map(card => ({
        id: card._id,
        title: card.title,
        columnName: column.title,
        label: card.label || 'Không có',
        priority: card.priority || 'None',
        dueDate: card.dueDate ? new Date(card.dueDate).toLocaleDateString() : 'Không có',
        progress: getProgressStatus(card)
        }))
    ) || []

    return (
        <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 150px)' }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell><b>Tên công việc</b></TableCell>
                        <TableCell><b>Tên cột</b></TableCell>
                        <TableCell><b>Tên nhãn</b></TableCell>
                        <TableCell><b>Độ ưu tiên</b></TableCell>
                        <TableCell><b>Ngày đến hạn</b></TableCell>
                        <TableCell><b>Tiến độ</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.id} hover>
                            <TableCell>{row.title}</TableCell>
                            <TableCell>{row.columnName}</TableCell>
                            <TableCell>
                                {row.label && typeof row.label === 'object' ? (
                                    <Chip 
                                    label={row.label.name} 
                                    size="small" 
                                    sx={{ 
                                        backgroundColor: row.label.color, 
                                        color: 'white',
                                        fontWeight: 'bold' 
                                    }} 
                                    />
                                ) : (
                                    <Chip label="Không có" size="small" />
                                )}
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={PRIORITIES[row.priority]?.name || PRIORITIES.none.name}
                                    size="small"
                                    sx={{
                                    backgroundColor: PRIORITIES[row.priority]?.color || PRIORITIES.none.color,
                                    color: 'white',
                                    fontWeight: 'bold'
                                    }}
                                />
                            </TableCell>
                            <TableCell>{row.dueDate}</TableCell>
                            <TableCell>{renderProgressChip(row.progress)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TableView
