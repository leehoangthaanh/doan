import { ObjectId, ReturnDocument } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

const USER_COLLECTION_NAME = 'users'

const USER_COLLECTION_SCHEMA = {
    fullName: '',
    birthDate: '', // định dạng ISO string
    hometown: '',
    username: '', // duy nhất
    password: '', // đã mã hóa
    createdAt: null,
    updatedAt: null
}

const createNew = async (data) => {
    try {
        const newUser = {
            ...USER_COLLECTION_SCHEMA,
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const result = await GET_DB()
            .collection(USER_COLLECTION_NAME)
            .insertOne(newUser)

        return result
    } catch (error) {
        throw new Error(error)
    }
}

const findOneByUsername = async (username) => {
    try {
        const result = await GET_DB()
            .collection(USER_COLLECTION_NAME)
            .findOne({ username })
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const findOneById = async (id) => {
    try {
        const result = await GET_DB()
            .collection(USER_COLLECTION_NAME)
            .findOne({ _id: new ObjectId(id) })
        return result
    } catch (error) {
        throw new Error(error)
    }
}

const findByIdAndUpdate = async (id, updateData) => {
    try {
        if (!ObjectId.isValid(id)) {
            throw new Error('ID không hợp lệ')
        }

        const objectId = new ObjectId(id)
        const db = GET_DB()
        const collection = db.collection(USER_COLLECTION_NAME)

        // Kiểm tra document có tồn tại không
        const foundUser = await collection.findOne({ _id: objectId })
        if (!foundUser) {
            throw new Error('Người dùng không tồn tại')
        }

        // Tiến hành cập nhật
        const result = await collection.updateOne(
            { _id: objectId },
            {
                $set: {
                    ...updateData,
                    updatedAt: new Date()
                }
            }
        )

        // Optional: kiểm tra có thay đổi gì không
        if (result.modifiedCount === 0) {
            console.warn('Không có gì thay đổi')
        }

        // Lấy lại document sau update (nếu cần)
        const updatedUser = await collection.findOne({ _id: objectId })

        return updatedUser
    } catch (error) {
        console.error('>>> Lỗi cập nhật user:', error)
        throw new Error(`Lỗi cập nhật người dùng: ${error.message}`)
    }
}

const updatePasswordById = async (id, newHashedPassword) => {
    try {
        if (!ObjectId.isValid(id)) {
            throw new Error('ID không hợp lệ')
        }

        const result = await GET_DB()
            .collection(USER_COLLECTION_NAME)
            .updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        password: newHashedPassword,
                        updatedAt: new Date()
                    }
                }
            )

        if (result.matchedCount === 0) {
            throw new Error('Không tìm thấy người dùng để cập nhật mật khẩu')
        }

        return result
    } catch (error) {
        throw new Error(`Lỗi cập nhật mật khẩu: ${error.message}`)
    }
}


export const userModel = {
    USER_COLLECTION_NAME,
    USER_COLLECTION_SCHEMA,
    createNew,
    findOneByUsername,
    findOneById,
    findByIdAndUpdate, updatePasswordById
}
