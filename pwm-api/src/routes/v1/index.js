import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoutes } from '~/routes/v1/boardRoute'
import { columnRoutes } from '~/routes/v1/columnRoute'
import { cardRoutes } from '~/routes/v1/cardRoute'
import { userRoutes } from '~/routes/v1/userRoute'

const Router = express.Router()
Router.get('/status', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'APIs V1 ready to use' })
})

Router.use('/board', boardRoutes)
Router.use('/column', columnRoutes)
Router.use('/card', cardRoutes)
Router.use('/user', userRoutes)

export const APIs_V1 = Router