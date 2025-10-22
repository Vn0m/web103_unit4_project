export const calculateTotalPrice = (selectedOptions) => {
  const basePrice = 25000 // Base price for the car
  let totalPrice = basePrice
  
  Object.values(selectedOptions).forEach(option => {
    if (option && option.price) {
      totalPrice += parseFloat(option.price) || 0 
    }
  })
  
  return totalPrice
}

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export const getPriceDifference = (totalPrice) => {
  const basePrice = 25000
  return totalPrice - basePrice
}
