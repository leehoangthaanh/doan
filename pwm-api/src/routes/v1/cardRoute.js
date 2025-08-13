import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'

const Router = express.Router()

Router.route('/')
    .post(cardValidation.createNew, cardController.createNew)

Router.route('/:id')
    .put(cardValidation.update, cardController.update)
    .delete(cardController.remove)

Router.route('/:id/move')
    .put(cardController.moveCard)

Router.get('/search', cardController.searchCards)

export const cardRoutes = Router