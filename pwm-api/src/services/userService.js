import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { userModel } from '~/models/userModel'
import { boardService } from '~/services/boardService'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'

const SALT_ROUNDS = 10

// Đăng ký người dùng mới
const register = async (reqBody) => {
    const { fullName, birthDate, hometown, username, password } = reqBody

    // Kiểm tra username đã tồn tại chưa
    const existingUser = await userModel.findOneByUsername(username)
    if (existingUser) {
        throw new ApiError(StatusCodes.CONFLICT, 'Tên đăng nhập đã được sử dụng!')
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const newUserData = {
        fullName,
        birthDate, // ISO format, client nên gửi đúng định dạng yyyy-mm-dd
        hometown,
        username,
        password: hashedPassword
    }

    const result = await userModel.createNew(newUserData)
    const userId = result.insertedId
    const defaultBoard = await boardService.createBoardForUser(userId)

    return {
        message: 'Đăng ký thành công!',
        userId: result.insertedId,
        board: defaultBoard
    }
}

// Đăng nhập người dùng
const login = async ({ username, password }) => {
    const user = await userModel.findOneByUsername(username)

    if (!user) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Tên đăng nhập hoặc mật khẩu không đúng!')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Tên đăng nhập hoặc mật khẩu không đúng!')
    }

    // Tạo JWT
    const token = jwt.sign(
        { userId: user._id.toString(), username: user.username },
        env.JWT_SECRET,
        { expiresIn: '1d' }
    )

    const boards = await boardService.getBoardsByUserId(user._id)

    return {
        message: 'Đăng nhập thành công!',
        token,
        user: {
            id: user._id,
            fullName: user.fullName,
            username: user.username,
            birthDate: user.birthDate,
            hometown: user.hometown
        },
        boards
    }
}

const update = async (id, data) => {
    const updatedUser = await userModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    })
    if (!updatedUser) throw new Error('Người dùng không tồn tại')
    return updatedUser
}

const changePassword = async (userId, { oldPassword, newPassword }) => {
    const user = await userModel.findOneById(userId)
    if (!user) throw new ApiError(404, 'Người dùng không tồn tại.')

    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) throw new ApiError(400, 'Mật khẩu hiện tại không đúng.')

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await userModel.updatePasswordById(userId, hashedPassword)

    return { message: 'Cập nhật mật khẩu thành công.' }
}


export const userService = {
    register,
    login,
    update,
    changePassword
}
