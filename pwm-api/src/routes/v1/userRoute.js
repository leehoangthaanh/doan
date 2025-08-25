import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/register')
    .post(userValidation.register, userController.register)

Router.route('/login')
    .post(userValidation.login, userController.login)

Router.route('/all')
    .get(
        authMiddleware.verifyToken,
        authMiddleware.isAdmin,
        userController.getAllUsers
    )

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

Router.route('/update-role/:id')
    .put(
        authMiddleware.verifyToken,
        authMiddleware.isAdmin,
        userController.updateRole
    )

Router.route('/delete/:id')
    .delete(
        authMiddleware.verifyToken,
        authMiddleware.isAdmin,
        userController.deleteUser
    )

export const userRoutes = Router
