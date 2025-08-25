import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

// Middleware xác thực JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Không có token'))
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded // lưu thông tin user vào request
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.UNAUTHORIZED, 'Token không hợp lệ hoặc đã hết hạn'))
    }
}   

// Middleware chỉ cho phép người dùng cập nhật chính họ
const allowSelfUpdateOnly = (req, res, next) => {
    const { id: paramId } = req.params
    const { userId: tokenUserId } = req.user

    if (paramId !== tokenUserId) {
        return next(new ApiError(StatusCodes.FORBIDDEN, 'Không được phép cập nhật thông tin người khác'))
    }

    next()
}

const isAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return next(new ApiError(StatusCodes.FORBIDDEN, 'Chỉ admin mới có quyền này'))
    }
    next()
}

export const authMiddleware = {
    verifyToken,
    allowSelfUpdateOnly,
    isAdmin
}
