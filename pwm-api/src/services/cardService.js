import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'

const createNew = async (reqBody) => {
    // eslint-disable-next-line no-useless-catch
    try {
        // Lấy thông tin cột theo columnId gửi lên
        const column = await columnModel.findOneById(reqBody.columnId)
        if (!column) throw new Error('Column không tồn tại')

        // Lấy properties của column (status, completed...)
        const { properties } = column

        const newCard = {
            ...reqBody,
            status: properties?.status || '',
            completed: properties?.completed ?? false
        }
        const createdCard = await cardModel.createNew(newCard)
        const getNewCard = await cardModel.findOneById(createdCard.insertedId)

        if (getNewCard) {
            await columnModel.pushCardOrderIds(getNewCard)
        }

        return getNewCard
    } catch (error) {
        throw error
    }
}

const update = async (cardId, updateData) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const updatedCard = await cardModel.update(cardId, updateData)
        return updatedCard
    } catch (error) {
        throw error
    }
}

const remove = async (cardId) => {
    const deletedCard = await cardModel.remove(cardId)
    return deletedCard
}

const searchCards = async (query) => {
    if (!query || typeof query !== 'string') {
        throw new Error('Query is required and must be a string')
    }
    const cards = await cardModel.searchCardsByQuery(query)
    return cards
}

const moveCard = async (cardId, sourceColumnId, destinationColumnId, sourceCardOrderIds, destinationCardOrderIds) => {
    // 1. Lấy cột đích để lấy thuộc tính mới
    const destinationColumn = await columnModel.findOneById(destinationColumnId)
    if (!destinationColumn) throw new Error('Column đích không tồn tại')

    const { properties } = destinationColumn

    // 2. Cập nhật card: columnId mới + các thuộc tính thừa hưởng
    await cardModel.update(cardId, {
        columnId: destinationColumnId,
        status: properties?.status || '',
        completed: properties?.completed ?? false
    })

    // 3. Cập nhật cardOrderIds của cột cũ và cột mới
    await columnModel.update(sourceColumnId, { cardOrderIds: sourceCardOrderIds })
    await columnModel.update(destinationColumnId, { cardOrderIds: destinationCardOrderIds })

    // 4. Trả về card đã cập nhật
    return await cardModel.findOneById(cardId)
}


export const cardService = {
    createNew,
    update,
    remove,
    searchCards,
    moveCard
}