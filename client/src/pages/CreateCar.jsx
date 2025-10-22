import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllOptions } from '../services/OptionsAPI'
import { createCar } from '../services/CarsAPI'
import { calculateTotalPrice, formatPrice } from '../utilities/priceCalculator'
import { validateCarConfiguration, isOptionCompatible, getIncompatibleOptions } from '../utilities/validation'
import '../App.css'

const CreateCar = () => {
  const navigate = useNavigate()
  const [options, setOptions] = useState({})
  const [selectedOptions, setSelectedOptions] = useState({
    exterior: null,
    wheels: null,
    interior: null,
    engine: null
  })
  const [carName, setCarName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadOptions()
  }, [])

  const loadOptions = async () => {
    try {
      const data = await getAllOptions()
      setOptions(data)
      
      const defaultOptions = {}
      Object.keys(data).forEach(category => {
        const defaultOption = data[category].find(option => option.is_default)
        if (defaultOption) {
          defaultOptions[category] = defaultOption
        }
      })
      setSelectedOptions(defaultOptions)
    } catch (error) {
      console.error('Error loading options:', error)
      setError('Failed to load customization options')
    } finally {
      setLoading(false)
    }
  }

  const handleOptionSelect = (category, option) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: option
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!carName.trim()) {
      setError('Please enter a name for your car')
      return
    }

    const validation = validateCarConfiguration(selectedOptions)
    if (!validation.isValid) {
      setError(validation.errors.join(', '))
      return
    }

    setSaving(true)
    setError('')

    try {
      const totalPrice = calculateTotalPrice(selectedOptions)
      const carData = {
        name: carName.trim(),
        exterior_color_id: selectedOptions.exterior.id,
        wheels_id: selectedOptions.wheels.id,
        interior_id: selectedOptions.interior.id,
        engine_id: selectedOptions.engine.id,
        total_price: totalPrice
      }

      await createCar(carData)
      navigate('/customcars')
    } catch (error) {
      console.error('Error creating car:', error)
      setError(error.message || 'Failed to create car')
    } finally {
      setSaving(false)
    }
  }

  const totalPrice = calculateTotalPrice(selectedOptions)

  if (loading) {
    return (
      <div className="container">
        <h2>Loading customization options...</h2>
      </div>
    )
  }

  return (
    <div className="container">
      <h2>Customize Your Bolt Bucket</h2>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid">
          <div className="customization-section">
            <h3>Exterior Color</h3>
            <div className="options-grid">
              {options.exterior?.map(option => (
                <div 
                  key={option.id} 
                  className={`option-card ${selectedOptions.exterior?.id === option.id ? 'selected' : ''} ${!isOptionCompatible(option, selectedOptions) ? 'incompatible' : ''}`}
                  onClick={() => handleOptionSelect('exterior', option)}
                >
                  <div className="option-preview" style={{ backgroundColor: getColorFromName(option.name) }}></div>
                  <h4>{option.name}</h4>
                  <p>{formatPrice(option.price)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="customization-section">
            <h3>Wheels</h3>
            <div className="options-grid">
              {options.wheels?.map(option => (
                <div 
                  key={option.id} 
                  className={`option-card ${selectedOptions.wheels?.id === option.id ? 'selected' : ''} ${!isOptionCompatible(option, selectedOptions) ? 'incompatible' : ''}`}
                  onClick={() => handleOptionSelect('wheels', option)}
                >
                  <div className="option-preview wheels-preview"></div>
                  <h4>{option.name}</h4>
                  <p>{formatPrice(option.price)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="customization-section">
            <h3>Interior</h3>
            <div className="options-grid">
              {options.interior?.map(option => (
                <div 
                  key={option.id} 
                  className={`option-card ${selectedOptions.interior?.id === option.id ? 'selected' : ''} ${!isOptionCompatible(option, selectedOptions) ? 'incompatible' : ''}`}
                  onClick={() => handleOptionSelect('interior', option)}
                >
                  <div className="option-preview interior-preview"></div>
                  <h4>{option.name}</h4>
                  <p>{formatPrice(option.price)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="customization-section">
            <h3>Engine</h3>
            <div className="options-grid">
              {options.engine?.map(option => (
                <div 
                  key={option.id} 
                  className={`option-card ${selectedOptions.engine?.id === option.id ? 'selected' : ''} ${!isOptionCompatible(option, selectedOptions) ? 'incompatible' : ''}`}
                  onClick={() => handleOptionSelect('engine', option)}
                >
                  <div className="option-preview engine-preview"></div>
                  <h4>{option.name}</h4>
                  <p>{formatPrice(option.price)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="car-summary">
          <h3>Your Custom Car</h3>
          <div className="car-preview">
            <div className="car-visual">
              <div 
                className="car-body" 
                style={{ backgroundColor: getColorFromName(selectedOptions.exterior?.name) }}
              ></div>
              <div className="car-wheels"></div>
            </div>
          </div>
          
          <div className="car-details">
            <div className="field">
              <label htmlFor="carName">Car Name:</label>
              <input
                type="text"
                id="carName"
                value={carName}
                onChange={(e) => setCarName(e.target.value)}
                placeholder="Enter a name for your car"
                required
              />
            </div>
            
            <div className="price-summary">
              <h4>Price Summary</h4>
              <p>Base Price: {formatPrice(25000)}</p>
              {selectedOptions.exterior && (
                <p>Exterior: {selectedOptions.exterior.name} (+{formatPrice(selectedOptions.exterior.price)})</p>
              )}
              {selectedOptions.wheels && (
                <p>Wheels: {selectedOptions.wheels.name} (+{formatPrice(selectedOptions.wheels.price)})</p>
              )}
              {selectedOptions.interior && (
                <p>Interior: {selectedOptions.interior.name} (+{formatPrice(selectedOptions.interior.price)})</p>
              )}
              {selectedOptions.engine && (
                <p>Engine: {selectedOptions.engine.name} (+{formatPrice(selectedOptions.engine.price)})</p>
              )}
              <hr />
              <h3>Total: {formatPrice(totalPrice)}</h3>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? 'Creating...' : 'Create Custom Car'}
          </button>
          <a href="/customcars" className="btn btn-secondary">View All Cars</a>
        </div>
      </form>
    </div>
  )
}

const getColorFromName = (name) => {
  const colorMap = {
    'Classic Red': '#dc2626',
    'Electric Blue': '#2563eb',
    'Midnight Black': '#1f2937',
    'Pearl White': '#f9fafb',
    'Racing Green': '#059669'
  }
  return colorMap[name] || '#6b7280'
}

export default CreateCar