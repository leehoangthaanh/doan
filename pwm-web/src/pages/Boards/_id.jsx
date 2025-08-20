  import { useEffect, useState } from 'react'
  import Container from '@mui/material/Container'
  import AppBar from '~/components/AppBar/AppBar'
  import BoardBar from './BoardBar/BoardBar'
  import BoardContent from './BoardContent/BoardContent'
  // import { mockData } from '~/apis/mock_data'
  import { 
    fetchBoardDetailsAPI, 
    createNewColumnAPI, 
    createNewCardAPI,
    updateCardAPI,
    deleteColumnAPI,
    deleteCardAPI
  } 
  from '~/apis/index'
  function Board() {
    const [board, setBoard] = useState(null)
    const [currentView, setCurrentView] = useState('board')
    const [boardId, setBoardId] = useState(null)

    const fetchBoard = async () => {
      if (!boardId) return
      try {
        const boardData = await fetchBoardDetailsAPI(boardId)
        setBoard(boardData)
      } catch (err) {
        console.error('Failed to fetch board:', err)
      }
    }


    useEffect(() => {
      const savedBoardId = localStorage.getItem('boardId')
      if (savedBoardId) {
        setBoardId(savedBoardId)
      }
    }, [])

    useEffect(() => {
      fetchBoard()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardId])

    const createNewColumn = async (newColumnData) => {
      await createNewColumnAPI({
        ...newColumnData,
        boardId
      })
      await fetchBoard()
    }

    const deleteColumn = async (columnId) => {
      await deleteColumnAPI(columnId)
      await fetchBoard() 
    }



    const createNewCard = async (newCardData) => {
      await createNewCardAPI({
        ...newCardData,
        boardId
      })
      await fetchBoard()
    }

    const updateCard = async ({ cardId, updateData }) => {
      await updateCardAPI({ cardId, updateData })
      await fetchBoard()
    }

    const deleteCard = async (cardId) => {
      await deleteCardAPI(cardId)
      await fetchBoard() 
    }

    return (
      <Container disableGutters maxWidth={false} sx={{height: '100vh'}}>
        <AppBar />
        <BoardBar board = {board} setCurrentView={setCurrentView} currentView={currentView} />
        <BoardContent
          board = {board}
          currentView={currentView}
          createNewColumn = {createNewColumn}
          deleteColumn = {deleteColumn}
          createNewCard = {createNewCard}
          updateCard={updateCard}
          deleteCard={deleteCard}
        />
      </Container>
    )
  }

  export default Board
