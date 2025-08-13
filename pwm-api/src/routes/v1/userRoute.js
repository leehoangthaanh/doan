import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/register')
    .post(userValidation.register, userController.register)

Router.route('/login')
    .post(userValidation.login, userController.login)

Router.route('/update/:id')
    .put(
        authMiddleware.verifyToken,
        authMiddleware.allowSelfUpdateOnly,
        userValidation.update,
        userController.update
    )

Router.route('/change-password')
    .put(
        authMiddleware.verifyToken,                
        userValidation.changePassword,             
        userController.changePassword              
    )


export const userRoutes = Router
