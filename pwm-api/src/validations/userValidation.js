import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

// Đăng ký
const register = async (req, res, next) => {
    const registerSchema = Joi.object({
        fullName: Joi.string().min(3).max(100).trim().allow(''),
        birthDate: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).message('Ngày sinh phải có định dạng yyyy-MM-dd').allow(''),
        hometown: Joi.string().min(2).max(100).trim().allow(''),
        username: Joi.string().required().alphanum().min(4).max(30),
        password: Joi.string().required().min(6),
        confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
            'any.only': 'Xác nhận mật khẩu không khớp với mật khẩu'
        })
    })

    try {
        await registerSchema.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ')
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage))
    }
}

// Đăng nhập
const login = async (req, res, next) => {
    const loginSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    })

    try {
        await loginSchema.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ')
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage))
    }
}

// Cập nhật thông tin
const update = (req, res, next) => {
    const schema = Joi.object({
        fullName: Joi.string().min(2).max(100).optional(),
        birthDate: Joi.string().optional(),
        hometown: Joi.string().optional()
        // username: Joi.string().min(3).max(50).optional()
        // password: Joi.string().optional(), // nếu cho phép sửa mật khẩu
    })

    const { error } = schema.validate(req.body, { abortEarly: false })

    if (error) {
        const message = error.details.map((d) => d.message).join(', ')
        return res.status(400).json({ error: message })
    }

    next()
}

const changePassword = (req, res, next) => {
    const schema = Joi.object({
        oldPassword: Joi.string().required().messages({
            'string.empty': 'Vui lòng nhập mật khẩu hiện tại.'
        }),
        newPassword: Joi.string().min(6).required().messages({
            'string.empty': 'Vui lòng nhập mật khẩu mới.',
            'string.min': 'Mật khẩu mới phải có ít nhất 6 ký tự.'
        }),
        confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
            'any.only': 'Xác nhận mật khẩu không khớp.',
            'string.empty': 'Vui lòng xác nhận mật khẩu mới.'
        })
    })

    const { error } = schema.validate(req.body)
    if (error) return res.status(400).json({ message: error.details[0].message })
    next()
}

export const userValidation = {
    register,
    login,
    update,
    changePassword
}
