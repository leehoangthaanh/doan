import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'

const createNew = async (reqBody) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const newColumn = {
            ...reqBody
        }
        const createdColumn = await columnModel.createNew(newColumn)
        const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

        if (getNewColumn) {
            getNewColumn.cards = []

            await boardModel.pushColumnOrderIds(getNewColumn)
        }

        return getNewColumn
    } catch (error) {
        throw error
    }
}

const remove = async (columnId) => {
    await cardModel.removeManyByColumnId(columnId)

    // Xoá column
    const deletedColumn = await columnModel.remove(columnId)
    return deletedColumn
}

const update = async (columnId, data) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const updatedColumn = await columnModel.update(columnId, data)
        return updatedColumn
    } catch (error) {
        throw error
    }
}


export const columnService = {
    createNew, remove, update
}