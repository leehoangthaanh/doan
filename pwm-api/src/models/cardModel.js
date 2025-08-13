/**
 * Updated by trungquandev.com's author on Oct 8 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection (name & schema)
const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().optional(),

    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
    return await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        const newCardToAdd = {
            ...validData,
            boardId: new ObjectId(validData.boardId),
            columnId: new ObjectId(validData.columnId)
        }
        const createdCard = await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(newCardToAdd)
        return createdCard
        // return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validData)
    } catch (error) {
        throw new Error(error)
    }
}

const findOneById = async (id) => {
    try {
        const result = await await GET_DB().collection(CARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (cardId, updateData) => {
    try {
        const updateObj = { ...updateData }

        // Nếu có thay đổi boardId hoặc columnId thì chuyển về ObjectId
        if (updateObj.boardId) updateObj.boardId = new ObjectId(updateObj.boardId)
        if (updateObj.columnId) updateObj.columnId = new ObjectId(updateObj.columnId)

        updateObj.updatedAt = Date.now()

        const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(cardId) },
            { $set: updateObj },
            { returnDocument: 'after' }
        )
        return result.value
    } catch (error) {
        throw new Error(error)
    }
}

const remove = async (cardId) => {
    if (!ObjectId.isValid(cardId)) {
        throw new Error('Invalid cardId')
    }

    const collection = GET_DB().collection(CARD_COLLECTION_NAME)

    const card = await collection.findOne({ _id: new ObjectId(cardId) })
    if (!card) return null

    const deleteResult = await collection.deleteOne({ _id: new ObjectId(cardId) })
    if (deleteResult.deletedCount !== 1) return null

    return card
}

const removeManyByColumnId = async (columnId) => {
    if (!ObjectId.isValid(columnId)) {
        throw new Error('Invalid columnId')
    }

    const collection = GET_DB().collection(CARD_COLLECTION_NAME)
    const deleteResult = await collection.deleteMany({ columnId: new ObjectId(columnId) })

    return deleteResult.deletedCount // trả về số lượng card đã xoá
}


const searchCardsByQuery = async (query) => {
    if (typeof query !== 'string' || query.trim() === '') {
        throw new Error('Invalid query string')
    }

    const db = await GET_DB()
    const collection = db.collection(CARD_COLLECTION_NAME)

    // Tạo regex tìm kiếm case-insensitive
    const regex = new RegExp(query.trim(), 'i')

    // Tìm trong title hoặc description
    const cards = await collection.find({
        $or: [
            { title: { $regex: regex } },
            { description: { $regex: regex } }
        ]
    }).toArray()

    return cards
}


export const cardModel = {
    CARD_COLLECTION_NAME,
    CARD_COLLECTION_SCHEMA,
    createNew, findOneById, 
    update, remove,
    removeManyByColumnId,
    searchCardsByQuery
}