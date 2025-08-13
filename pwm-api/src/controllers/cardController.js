import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'
const createNew = async (req, res, next) => {
    try {
        const createdCard = await cardService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdCard)
    } catch (error) { next(error) }
}

const update = async (req, res, next) => {
    try {
        const cardId = req.params.id
        const updatedCard = await cardService.update(cardId, req.body)
        res.status(StatusCodes.OK).json(updatedCard)
    } catch (error) {
        next(error)
    }
}

const remove = async (req, res, next) => {
    try {
        const { id } = req.params
        const deletedCard = await cardService.remove(id)

        if (!deletedCard) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Card not found' })
        }

        return res.status(StatusCodes.OK).json({
            message: 'Card deleted successfully',
            card: deletedCard
        })
    } catch (error) {
        next(error)
    }
}

const searchCards= async (req, res, next) => {
    try {
        const { q } = req.query
        if (!q) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Query parameter q is required' })
        }
        const cards = await cardService.searchCards(q)
        res.status(StatusCodes.OK).json(cards)
    } catch (error) {
        next(error)
    }
}

const moveCard = async (req, res, next) => {
    try {
        const cardId = req.params.id
        const { sourceColumnId, destinationColumnId, sourceCardOrderIds, destinationCardOrderIds } = req.body

        const movedCard = await cardService.moveCard(
            cardId,
            sourceColumnId,
            destinationColumnId,
            sourceCardOrderIds,
            destinationCardOrderIds
        )

        res.status(StatusCodes.OK).json(movedCard)
    } catch (error) {
        next(error)
    }
}


export const cardController = {
    createNew,
    update,
    remove,
    searchCards,
    moveCard
}