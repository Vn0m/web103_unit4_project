import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCarById, updateCar } from '../services/CarsAPI'
import { getAllOptions } from '../services/OptionsAPI'
import { calculateTotalPrice, formatPrice } from '../utilities/priceCalculator'
import { validateCarConfiguration, isOptionCompatible } from '../utilities/validation'
import '../App.css'

const EditCar = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
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
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      const [carData, optionsData] = await Promise.all([
        getCarById(id),
        getAllOptions()
      ])
      
      setCar(carData)
      setOptions(optionsData)
      setCarName(carData.name)
      
      // Set selected options based on current car
      setSelectedOptions({
        exterior: optionsData.exterior?.find(opt => opt.id === carData.exterior_color_id),
        wheels: optionsData.wheels?.find(opt => opt.id === carData.wheels_id),
        interior: optionsData.interior?.find(opt => opt.id === carData.interior_id),
        engine: optionsData.engine?.find(opt => opt.id === carData.engine_id)
      })
    } catch (error) {
      console.error('Error loading data:', error)
      setError('Failed to load car data')
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

    // Validate configuration
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

      await updateCar(id, carData)
      navigate(`/customcars/${id}`)
    } catch (error) {
      console.error('Error updating car:', error)
      setError(error.message || 'Failed to update car')
    } finally {
      setSaving(false)
    }
  }

  const totalPrice = calculateTotalPrice(selectedOptions)

  if (loading) {
    return (
      <div className="container">
        <h2>Loading car data...</h2>
      </div>
    )
  }

  if (error && !car) {
    return (
      <div className="container">
        <div className="alert alert-error">
          {error}
        </div>
        <button onClick={() => navigate('/customcars')} className="btn btn-primary">
          Back to Cars
        </button>
      </div>
    )
  }

  return (
    <div className="container">
      <h2>Edit Your Bolt Bucket</h2>
      
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
          <h3>Your Updated Car</h3>
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
            {saving ? 'Updating...' : 'Update Car'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate(`/customcars/${id}`)} 
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

// Helper function to get color from option name
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

export default EditCar