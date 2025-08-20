// import { slugify } from '~/utils/formaters'
import { ObjectId } from 'mongodb'
import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'

const createNew = async (reqBody) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const newBoard = {
            title: reqBody.title,
            description: reqBody.description || 'This is your first board',
            type: reqBody.type || 'private',
            ownerId: reqBody.ownerId
        }

        const createdBoard = await boardModel.createNew(newBoard)

        const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
        return getNewBoard
    } catch (error) {
        throw error
    }
}


const createBoardForUser = async (userId) => {
    // 1. Tạo board mới với defaultBoardData đúng y như bạn cung cấp
    const defaultBoardData = {
        title: 'Bảng Công Việc',
        description: 'Board mặc định khi đăng ký',
        type: 'private',
        ownerId: userId.toString(),
        columnOrderIds: []
    }

    const createdBoard = await boardModel.createNew(defaultBoardData)
    const boardId = createdBoard.insertedId.toString()

    // 2. Định nghĩa 4 cột mặc định
    const defaultColumnsRaw = [
        {
            boardId,
            title: 'To Do',
            cardOrderIds: [],
            properties: {
                status: 'Chưa bắt đầu',
                completed: false
            }
        },
        {
            boardId,
            title: 'In Progress',
            cardOrderIds: [],
            properties: {
                status: 'CV đang làm',
                completed: false
            }
        },
        {
            boardId,
            title: 'Review',
            cardOrderIds: [],
            properties: {
                status: 'Chờ Review',
                completed: false
            }
        },
        {
            boardId,
            title: 'Done',
            cardOrderIds: [],
            properties: {
                status: 'Hoàn thành',
                completed: true
            }
        }
    ]

    // 3. Convert boardId sang ObjectId, chuẩn bị columns cho insertMany
    const defaultColumns = defaultColumnsRaw.map(col => ({
        ...col,
        boardId: new ObjectId(col.boardId)
    }))

    // 4. Tạo nhiều cột cùng lúc
    const createdColumns = await columnModel.insertMany(defaultColumns)

    // 5. Lấy các insertedId của cột để cập nhật lên board.columnOrderIds
    const columnOrderIds = createdColumns.map(col => col.insertedId)

    // 6. Cập nhật columnOrderIds cho board
    await boardModel.update(boardId, { columnOrderIds })

    // 7. Trả về board đã tạo kèm cột
    return {
        _id: boardId,
        ...defaultBoardData,
        columnOrderIds,
        columns: createdColumns
    }
}

const getBoardsByUserId = async (userId) => {
    try {
        const boards = await boardModel.findByOwnerId(userId)
        return boards
    } catch (error) {
        throw new Error(error)
    }
}

const getDetails = async (boardId) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const board = await boardModel.getDetails(boardId)
        if (!board) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
        }

        const resBoard = cloneDeep(board)
        resBoard.columns.forEach(column => {
            column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))

            // column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
        })

        delete resBoard.cards

        return resBoard
    } catch (error) { throw error }
}

const update = async (boardId, data) => {
    return await boardModel.update(boardId, data)
}

export const boardService = {
    createNew, createBoardForUser, getDetails, update, getBoardsByUserId
}