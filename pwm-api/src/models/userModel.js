import { ObjectId, ReturnDocument } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

const USER_COLLECTION_NAME = 'users'

const USER_COLLECTION_SCHEMA = {
    fullName: '',
    birthDate: '', // định dạng ISO string
    hometown: '',
    username: '', // duy nhất
    password: '', // đã mã hóa
    role: 'user', // 'user' | 'admin'
    isSuperAdmin: false,
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

const getAllUsers = async () => {
    try {
        const db = GET_DB()

        const users = await db.collection(USER_COLLECTION_NAME).find({}).toArray()
        const userIdsStr = users.map(u => u._id.toString())

        // Lấy boards thuộc các users hiện tại
        const boards = await db
            .collection('boards')
            .find({ ownerId: { $in: userIdsStr } })
            .toArray()

        const boardIds = boards.map(b => b._id)

        // Lấy columns thuộc các board đó
        const columns = await db
            .collection('columns')
            .find({ boardId: { $in: boardIds } })
            .toArray()

        // Tổng hợp tất cả cardOrderIds (chuỗi) từ các column
        const cardIdsStr = columns.flatMap(c => c.cardOrderIds || [])

        // Chuyển card IDs (chuỗi) thành ObjectId để truy vấn
        const cardObjectIds = cardIdsStr.map(id => {
            try {
                return new ObjectId(id)
            } catch {
                return null
            }
        }).filter(Boolean)

        // Lấy toàn bộ cards từ DB theo ObjectId
        const cards = cardObjectIds.length
            ? await db.collection('cards').find({ _id: { $in: cardObjectIds } }).toArray()
            : []

        // Tính số cột và số thẻ cho từng user
        const usersWithCounts = users.map(user => {
            const userIdStr = user._id.toString()
            const userBoard = boards.find(b => b.ownerId === userIdStr)

            if (!userBoard) {
                return { ...user, columnCount: 0, cardCount: 0 }
            }

            const boardIdStr = userBoard._id.toString()
            const userColumns = columns.filter(c => c.boardId.toString() === boardIdStr)
            const userColumnIds = userColumns.map(col => col._id.toString())

            const userColumnCount = userColumns.length
            const userCards = cards.filter(card =>
                userColumnIds.includes(card.columnId.toString())
            )

            return {
                ...user,
                columnCount: userColumns.length,
                cardCount: userCards.length
            }
        })

        return usersWithCounts
    } catch (error) {
        throw new Error(`Lỗi lấy danh sách người dùng: ${error.message}`)
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

const deleteUserById = async (id, currentUser) => {
    try {
        if (!ObjectId.isValid(id)) {
            throw new Error('ID không hợp lệ')
        }

        const objectId = new ObjectId(id)
        const db = GET_DB()
        const collection = db.collection(USER_COLLECTION_NAME)

        // Tìm user cần xoá
        const userToDelete = await collection.findOne({ _id: objectId })
        if (!userToDelete) {
            throw new Error('Người dùng không tồn tại')
        }

        // --- Kiểm tra quyền ---
        // Nếu currentUser là superadmin -> xoá tất cả ok
        if (currentUser.isSuperAdmin) {
            return await collection.deleteOne({ _id: objectId })
        }

        // Nếu chỉ là admin thường
        if (currentUser.role === 'admin') {
        // Không cho phép admin xoá admin khác hoặc superadmin
            if (userToDelete.role === 'admin' || userToDelete.isSuperAdmin) {
                throw new Error('Bạn không có quyền xoá Admin khác')
            }
            return await collection.deleteOne({ _id: objectId })
        }

        // Nếu là user thường thì không có quyền
        throw new Error('Bạn không có quyền xoá người dùng')

    } catch (error) {
        console.error('>>> Lỗi xoá user:', error)
        throw new Error(`Lỗi xoá người dùng: ${error.message}`)
    }
}


export const userModel = {
    USER_COLLECTION_NAME,
    USER_COLLECTION_SCHEMA,
    createNew,
    findOneByUsername,
    findOneById,
    findByIdAndUpdate, updatePasswordById, deleteUserById,
    getAllUsers
}
