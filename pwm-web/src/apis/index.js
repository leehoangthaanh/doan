import axios from 'axios'
import { API_ROOT } from '~/utils/constanst'

export const fetchBoardDetailsAPI = async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/board/${boardId}`)
    return response.data
}
export const loginAPI = async ({ username, password }) => {
  const res = await axios.post(`${API_ROOT}/v1/user/login`, {
    username,
    password
  })
  return res.data
}

export const updateUserAPI = async (id, updatedData, token) => {
  const response = await axios.put(`${API_ROOT}/v1/user/update/${id}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}

export const changePasswordAPI = async (passwordData, token) => {
  const response = await axios.put(`${API_ROOT}/v1/user/change-password`, passwordData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}

export const createNewColumnAPI = async (newColumnData) => {
    const response = await axios.post(`${API_ROOT}/v1/column`, newColumnData)
    return response.data
}

export const deleteColumnAPI = async (columnId) => {
  const response = await axios.delete(`${API_ROOT}/v1/column/${columnId}`)
  return response.data
}


export const createNewCardAPI = async (newCardData) => {
    const response = await axios.post(`${API_ROOT}/v1/card`, newCardData)
    return response.data
}


export const updateCardAPI = async ({ cardId, updateData }) => {
  const res = await axios.put(`${API_ROOT}/v1/card/${cardId}`, updateData)
  return res.data
}

export const deleteCardAPI = async (cardId) => {
  const response = await axios.delete(`${API_ROOT}/v1/card/${cardId}`)
  return response.data
}

export const fetchCardSearchAPI = async (query) => {
  const response = await axios.get(`${API_ROOT}/v1/card/search?q=${encodeURIComponent(query)}`)
  return response.data
}

export const moveColumnAPI = async (boardId, newColumnOrderIds) => {
  const response = await axios.put(`${API_ROOT}/v1/board/${boardId}`, {
    columnOrderIds: newColumnOrderIds
  })
  return response.data
}


export const moveCardAPI = async ({ 
  cardId, 
  sourceColumnId, 
  destinationColumnId, 
  sourceCardOrderIds, 
  destinationCardOrderIds 
}) => {
  const response = await axios.put(`${API_ROOT}/v1/card/${cardId}/move`, {
    cardId,
    sourceColumnId,
    destinationColumnId,
    sourceCardOrderIds,
    destinationCardOrderIds
  })
  return response.data
}

export const updateColumnOrderAPI = async (columnId, newCardOrderIds) => {
  const response = await axios.put(`${API_ROOT}/v1/column/${columnId}`, {
    cardOrderIds: newCardOrderIds
  })
  return response.data
}

export const getUsersAPI = async () => {
  try {
    const res = await axios.get(`${API_ROOT}/v1/user/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    return res.data
  } catch (error) {
    throw error.response?.data || error
  }
}

// Xóa user theo id
export const deleteUserAPI = async (id) => {
  try {
    const res = await axios.delete(`${API_ROOT}/v1/user/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    return res.data
  } catch (error) {
    throw error.response?.data || error
  }
}

export const updateUserRoleAPI = async (id, role) => {
  try {
    const res = await axios.put(`${API_ROOT}/v1/user/update-role/${id}`, { role }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    return res.data.user // hoặc tùy response bạn trả về
  } catch (error) {
    throw error.response?.data || error
  }
}

