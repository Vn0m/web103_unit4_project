const API_BASE_URL = 'http://localhost:3000/api'

export const getAllCars = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cars`)
    if (!response.ok) {
      throw new Error('Failed to fetch cars')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching cars:', error)
    throw error
  }
}

export const getCarById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cars/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch car')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching car:', error)
    throw error
  }
}

export const createCar = async (carData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cars`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carData),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create car')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error creating car:', error)
    throw error
  }
}

export const updateCar = async (id, carData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carData),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to update car')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error updating car:', error)
    throw error
  }
}

export const deleteCar = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to delete car')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error deleting car:', error)
    throw error
  }
}
