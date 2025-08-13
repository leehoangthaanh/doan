import { slugify } from '~/utils/formaters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'

const createNew = async (reqBody) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const newBoard = {
            ...reqBody,
            slug: slugify(reqBody.title)
        }
        const createdBoard = await boardModel.createNew(newBoard)
        // console.log(createdBoard)

        const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
        // console.log(getNewBoard)

        return getNewBoard
    } catch (error) {
        throw error
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
    createNew, getDetails, update
}