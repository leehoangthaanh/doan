import React, { useEffect, useState, useCallback, useRef } from 'react'
import Box from '@mui/material/Box'
import { mapOrder } from '~/utils/sorts'
import ListColumns from './ListColumns/ListColumns'
import { moveCardAPI, moveColumnAPI } from '~/apis/index'
import CalendarView from './Views/CalendarView'
import DashboardView from './Views/DashboardView'
import TableView from './Views/TableView'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'
import { 
  DndContext, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragOverlay, 
  closestCorners, 
  defaultDropAnimationSideEffects,
  pointerWithin,
  // rectIntersection,
  getFirstCollision,
  // closestCenter
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board, currentView, createNewColumn, deleteColumn, createNewCard, updateCard, deleteCard }) {
  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 5 } }) // giảm delay
  const sensors = useSensors(pointerSensor)

  const [orderedColumns, setorderedColumns] = useState([])

  const [activeDragItemId, setactiveDragItemId] = useState(null)
  const [activeDragItemType, setactiveDragItemType] = useState(null)
  const [activeDragItemData, setactiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setoldColumnWhenDraggingCard] = useState(null)

  const lastOverId = useRef(null)

  useEffect(() => {
  const ordered = mapOrder(board?.columns, board?.columnOrderIds, '_id')?.map(col => {
    // Nếu column rỗng thì thêm placeholder
    if (!col.cards || col.cards.length === 0) {
      const placeholder = generatePlaceholderCard(col)
      col.cards = [placeholder]
      col.cardOrderIds = [placeholder._id]
    }
    return col
  })
  setorderedColumns(ordered)
}, [board])


  const allCards = orderedColumns?.flatMap(column => column.cards || []) || []

  const cardsWithDueDate = allCards
    .filter(card => card.dueDate)
    .map(card => ({
      id: card._id,
      title: card.title,
      date: new Date(card.dueDate),
      ...card
    }))

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setorderedColumns(prevColumns => {
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

        let newCardIndex
        const isBelowOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height / 2
        const modifier = isBelowOverItem ? 1 : 0

        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1 

        const nextColumns = cloneDeep(prevColumns)
        const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

        if(nextActiveColumn) {
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

          if(isEmpty(nextActiveColumn?.cards)) {
            nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
          }

          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }

        if(nextOverColumn) {
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
          
          const rebuild_activeDraggingCardData = {
            ...activeDraggingCardData,
            columnId: nextOverColumn._id,
            status: nextOverColumn?.properties?.status,
            completed: nextOverColumn?.properties?.completed
          }

          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0 , rebuild_activeDraggingCardData)

          nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)

          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)

          // updateCard({
          //   cardId: activeDraggingCardId,
          //   updateData: { columnId: nextOverColumn._id }
          // })
        }
        return nextColumns
      })
  }

  const handleDragStart = (event) => {
    const isCard = !!event?.active?.data?.current?.columnId
    const rect = event.active.rect.current.translated || event.active.rect.current.initial

    setactiveDragItemId(event?.active?.id)
    setactiveDragItemType(isCard ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setactiveDragItemData({
      ...event?.active?.data?.current,
      width: rect?.width,
      height: rect?.height
    })

    if (event?.active?.data?.current?.columnId) {
      setoldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  const handleDragOver = (event) => {
    if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    const { active, over } = event

    if(!active || !over) return 

    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if(!activeColumn || !overColumn) return 

    if(activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
    }
  }



  const handleDragEnd = async (event) => {
    const { active, over } = event
    if (!active || !over) return

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      const { id: overCardId } = over

      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn?._id || !overColumn?._id) return

      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        // Khác column
        const sourceCardOrderIds = activeColumn.cardOrderIds.filter(id => id !== activeDraggingCardId)
        const destinationCardOrderIds = [...overColumn.cardOrderIds]
        const overIndex = destinationCardOrderIds.indexOf(overCardId)
        destinationCardOrderIds.splice(overIndex, 0, activeDraggingCardId)

        // Update FE
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )

        // API BE
        await moveCardAPI({
          cardId: activeDraggingCardId,
          sourceColumnId: activeColumn._id,
          destinationColumnId: overColumn._id,
          sourceCardOrderIds,
          destinationCardOrderIds
        })

        // await updateCardAPI(activeDraggingCardId, {
        //   ...activeDraggingCardData,
        //   columnId: overColumn._id
        // })

      } else {
        // Cùng column
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        setorderedColumns(prevColumns => {
          const nextColumns = cloneDeep(prevColumns)
          const targetColumns = nextColumns.find(c => c._id === overColumn._id)
          targetColumns.cards = dndOrderedCards
          targetColumns.cardOrderIds = dndOrderedCards.map(card => card._id)
          return nextColumns
        })

        await moveCardAPI({
          cardId: activeDraggingCardId,
          sourceColumnId: activeColumn._id,
          destinationColumnId: activeColumn._id,
          sourceCardOrderIds: dndOrderedCards.map(card => card._id),
          destinationCardOrderIds: dndOrderedCards.map(card => card._id)
        })
      }
    }

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)
        const dndorderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        setorderedColumns(dndorderedColumns)

        await moveColumnAPI(board._id, dndorderedColumns.map(c => c._id))
      }
    }

    // Reset drag state
    setactiveDragItemId(null)
    setactiveDragItemType(null)
    setactiveDragItemData(null)
    setoldColumnWhenDraggingCard(null)
  }






  const dropAnimation = { 
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } } )
  }

  const collisionDetectionStrategy = useCallback((args) =>{
    if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({...args})
    }
    const pointerIntersections = pointerWithin(args)

    if(!pointerIntersections?.length) return

    // const intersections = pointerIntersections?.length > 0
    // ? pointerIntersections
    // : rectIntersection(args)

    let overId = getFirstCollision(pointerIntersections, 'id')

    if(overId) {
      const checkColumn = orderedColumns.find(column => column._id === overId)
      if(checkColumn) {
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds.includes(container.id))
          })
        })[0]?.id
      }

      lastOverId.current = overId
      return [{ id: overId }]
    }

    return lastOverId.current ? [{ id: lastOverId.current }] : []

  },[activeDragItemType, orderedColumns])

  const renderView = () => {
    switch (currentView) {
      case 'calendar':
        return <CalendarView events={cardsWithDueDate} />
      case 'dashboard':
        return <DashboardView board={{...board, columns: orderedColumns}} />
      case 'table':
        return <TableView board={{...board, columns: orderedColumns}} />
      case 'board':
      default:
        return (
          <ListColumns
            columns={orderedColumns}
            createNewColumn={createNewColumn}
            createNewCard={createNewCard}
            updateCard={updateCard}
            deleteColumn={deleteColumn}
            deleteCard={deleteCard}
          />
        )
    }
  }

  return (
    <DndContext
      sensors={sensors}
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          p: '10px 0',
          overflow: 'visible' // tránh cắt overlay
        }}
      >
        {renderView()}

        <DragOverlay adjustScale={false} dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && activeDragItemData && (
            <Column
              column={activeDragItemData}
              style={{
                pointerEvents: 'none',
                width: activeDragItemData.width,
                height: activeDragItemData.height
              }}
            />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && activeDragItemData && (
            <Card
              card={activeDragItemData}
              style={{
                pointerEvents: 'none',
                width: activeDragItemData.width,
                height: activeDragItemData.height
              }}
            />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
