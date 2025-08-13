import express from 'express'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import exitHook from 'async-exit-hook'
import { env } from '~/config/environment'
import { CONNECT_DB, CLOSE_DB, GET_DB } from '~/config/mongodb'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
    const app = express()

    app.use(cors(corsOptions))

    app.use(express.json())

    app.use('/v1', APIs_V1)

    app.use(errorHandlingMiddleware)

    app.listen(env.APP_PORT, env.APP_HOST, () => {
        console.log(`Hello ${env.AUTHOR} Dev, I am running at http://${env.APP_HOST}:${env.APP_PORT}/`)
    })
    exitHook(() => {
        CLOSE_DB()
    })
}

CONNECT_DB()
    .then(() => console.log('Connected to MongoDB Cloud Atlas!'))
    .then(() => START_SERVER())
    .catch(error => {
        console.error(error)
        process.exit()
    })