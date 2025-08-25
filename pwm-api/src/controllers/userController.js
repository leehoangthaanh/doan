import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
import { userModel } from '~/models/userModel'

const register = async (req, res, next) => {
    try {
        const createdUser = await userService.register(req.body)
        res.status(StatusCodes.CREATED).json(createdUser)
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const { token, user, boards } = await userService.login(req.body)
        res.status(StatusCodes.OK).json({ token, user, boards })
    } catch (error) {
        next(error)
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers()
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params
        const updatedUser = await userService.update(id, req.body)
        res.status(200).json({ message: 'Cập nhật thành công', user: updatedUser })
    } catch (error) {
        console.error('Lỗi cập nhật:', error.message)
        res.status(500).json({ message: error.message || 'Lỗi máy chủ' })
    }
}

const changePassword = async (req, res) => {
    try {
        const userId = req.user.userId // đúng cách lấy ID từ token đã xác thực
        const result = await userService.changePassword(userId, req.body)
        return res.status(200).json({ message: 'Đổi mật khẩu thành công', result })
    } catch (error) {
        const status = error.status || 500
        return res.status(status).json({ message: error.message })
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params // id của user cần xóa
        const currentUser = req.user // user đang đăng nhập (đã được gắn từ middleware JWT)

        const result = await userService.deleteUser(id, currentUser)
        return res.status(StatusCodes.OK).json({
            message: 'Xóa người dùng thành công',
            result
        })
    } catch (error) {
        const status = error.status || 500
        return res.status(status).json({ message: error.message })
    }
}

const updateRole = async (req, res, next) => {
    try {
        const { id } = req.params
        const { role } = req.body

        const updatedUser = await userService.updateUserRole(id, role)

        res.status(200).json({
            message: 'Cập nhật quyền thành công',
            user: updatedUser
        })
    } catch (error) {
        next(error)
    }
}


export const userController = {
    register,
    login,
    update,
    changePassword,
    deleteUser,
    getAllUsers,
    updateRole
}
