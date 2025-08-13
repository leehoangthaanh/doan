import React from 'react'
import Box from '@mui/material/Box'
import Card from './Card/Card'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

function ListCards({ cards, updateCard, deleteCard }) {
  return (
    <SortableContext items={cards?.map(c => c._id)} strategy={verticalListSortingStrategy} >
      <Box
        sx={{
          p: '0 5px 5px 5px',
          m: '0 5px',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          // overflowX: 'hidden', 
          overflowY: 'auto',
          maxHeight: (theme) => `calc(
            ${theme.trello.boardContentHeight} - 
            ${theme.spacing(5)} - 
            ${theme.trello.columnHeaderHeight} - 
            ${theme.trello.columnFooterHeight}
          )`,
        }}
      >
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            updateCard={updateCard}
            deleteCard={deleteCard}
            sx={{ flexShrink: 0 }}
          />
        ))}
      </Box>
    </SortableContext>
  )
}

export default ListCards