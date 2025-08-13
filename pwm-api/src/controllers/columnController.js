import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'
const createNew = async (req, res, next) => {
    try {
        const createdColumn = await columnService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdColumn)
    } catch (error) { next(error) }
}

const remove = async (req, res, next) => {
    try {
        const { id } = req.params
        const deletedColumn = await columnService.remove(id)

        if (!deletedColumn) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Column not found' })
        }

        return res.status(StatusCodes.OK).json({
            message: 'Column deleted successfully',
            column: deletedColumn
        })
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const { id } = req.params
        const updatedColumn = await columnService.update(id, req.body)

        if (!updatedColumn) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Column not found' })
        }

        return res.status(StatusCodes.OK).json(updatedColumn)
    } catch (error) {
        next(error)
    }
}


export const columnController = {
    createNew, remove, update
}