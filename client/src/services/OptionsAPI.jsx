const API_BASE_URL = 'http://localhost:3000/api'

export const getAllOptions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/options`)
    if (!response.ok) {
      throw new Error('Failed to fetch options')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching options:', error)
    throw error
  }
}

export const getOptionsByCategory = async (category) => {
  try {
    const response = await fetch(`${API_BASE_URL}/options/category/${category}`)
    if (!response.ok) {
      throw new Error('Failed to fetch options')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching options by category:', error)
    throw error
  }
}

export const getOptionById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/options/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch option')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching option:', error)
    throw error
  }
}
