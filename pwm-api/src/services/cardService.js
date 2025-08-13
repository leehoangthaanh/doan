import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'

const createNew = async (reqBody) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const newCard = {
            ...reqBody
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
    // 1. Cập nhật columnId của card
    await cardModel.update(cardId, { columnId: destinationColumnId })

    // 2. Cập nhật cardOrderIds của column cũ
    await columnModel.update(sourceColumnId, { cardOrderIds: sourceCardOrderIds })

    // 3. Cập nhật cardOrderIds của column mới
    await columnModel.update(destinationColumnId, { cardOrderIds: destinationCardOrderIds })

    // 4. Trả về card sau khi move
    return await cardModel.findOneById(cardId)
}


export const cardService = {
    createNew,
    update,
    remove,
    searchCards,
    moveCard
}