import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'


const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        title: Joi.string().required().min(3).max(50).trim().strict()
    })

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        const errorMessage = new Error(error).message
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))

    }
}

const update = async (req, res, next) => {
    const updateCondition = Joi.object({
        title: Joi.string().min(1).max(100).trim().strict(),
        description: Joi.string().allow('').max(1000).trim().strict(),
        dueDate: Joi.date().iso().allow(null),
        label: Joi.object({
            name: Joi.string().min(1).max(100).required(),
            color: Joi.string().pattern(/^#([0-9A-Fa-f]{3}){1,2}$/).required()
        }).allow(null),
        priority: Joi.string().valid('high', 'medium', 'low', 'none').allow(null),
        cover: Joi.string()
            .pattern(
                /^#([0-9A-Fa-f]{3}){1,2}$|^([a-zA-Z]+)$|^(https?:\/\/.+)$|^data:image\/(png|jpeg|jpg|gif);base64,[A-Za-z0-9+/=]+$/
            )
            .allow(null, ''),
        completed: Joi.boolean()
    })

    try {
        await updateCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }
}


export const cardValidation = {
    createNew,
    update
}