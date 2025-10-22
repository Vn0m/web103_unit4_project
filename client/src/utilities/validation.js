export const validateCarConfiguration = (selectedOptions) => {
  const errors = []
  
  const requiredCategories = ['exterior', 'wheels', 'interior', 'engine']
  requiredCategories.forEach(category => {
    if (!selectedOptions[category]) {
      errors.push(`${category} option is required`)
    }
  })
  
  if (selectedOptions.exterior && selectedOptions.wheels) {
    if (selectedOptions.exterior.name === 'Classic Red' && selectedOptions.wheels.name === 'Chrome Spinners') {
      errors.push('Classic Red exterior is not compatible with Chrome Spinners')
    }
  }
  
  if (selectedOptions.engine && selectedOptions.interior) {
    if (selectedOptions.engine.name === 'Electric Motor' && selectedOptions.interior.name === 'Racing Seats') {
      errors.push('Electric Motor is not compatible with Racing Seats')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const isOptionCompatible = (option, selectedOptions) => {
  // Check exterior compatibility
  if (option.category === 'exterior' && selectedOptions.wheels) {
    if (option.name === 'Classic Red' && selectedOptions.wheels.name === 'Chrome Spinners') {
      return false
    }
  }
  
  if (option.category === 'wheels' && selectedOptions.exterior) {
    if (option.name === 'Chrome Spinners' && selectedOptions.exterior.name === 'Classic Red') {
      return false
    }
  }

  if (option.category === 'engine' && selectedOptions.interior) {
    if (option.name === 'Electric Motor' && selectedOptions.interior.name === 'Racing Seats') {
      return false
    }
  }
  
  if (option.category === 'interior' && selectedOptions.engine) {
    if (option.name === 'Racing Seats' && selectedOptions.engine.name === 'Electric Motor') {
      return false
    }
  }
  
  return true
}

export const getIncompatibleOptions = (option, allOptions) => {
  const incompatible = []
  
  if (option.category === 'exterior' && option.name === 'Classic Red') {
    const chromeWheels = allOptions.wheels?.find(w => w.name === 'Chrome Spinners')
    if (chromeWheels) incompatible.push(chromeWheels)
  }
  
  if (option.category === 'wheels' && option.name === 'Chrome Spinners') {
    const redExterior = allOptions.exterior?.find(e => e.name === 'Classic Red')
    if (redExterior) incompatible.push(redExterior)
  }
  
  if (option.category === 'engine' && option.name === 'Electric Motor') {
    const racingSeats = allOptions.interior?.find(i => i.name === 'Racing Seats')
    if (racingSeats) incompatible.push(racingSeats)
  }
  
  if (option.category === 'interior' && option.name === 'Racing Seats') {
    const electricEngine = allOptions.engine?.find(e => e.name === 'Electric Motor')
    if (electricEngine) incompatible.push(electricEngine)
  }
  
  return incompatible
}
