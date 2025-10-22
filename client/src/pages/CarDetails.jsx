import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCarById, deleteCar } from '../services/CarsAPI'
import { formatPrice } from '../utilities/priceCalculator'
import '../App.css'

const CarDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadCar()
  }, [id])

  const loadCar = async () => {
    try {
      const data = await getCarById(id)
      setCar(data)
    } catch (error) {
      console.error('Error loading car:', error)
      setError('Failed to load car details')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this car?')) {
      return
    }

    setDeleting(true)
    try {
      await deleteCar(id)
      navigate('/customcars')
    } catch (error) {
      console.error('Error deleting car:', error)
      setError('Failed to delete car')
    } finally {
      setDeleting(false)
    }
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

  if (loading) {
    return (
      <div className="container">
        <h2>Loading car details...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">
          {error}
        </div>
        <Link to="/customcars" className="btn btn-primary">Back to Cars</Link>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="container">
        <h2>Car not found</h2>
        <Link to="/customcars" className="btn btn-primary">Back to Cars</Link>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="page-header">
        <Link to="/customcars" className="btn btn-secondary">← Back to Cars</Link>
        <div className="car-actions">
          <Link to={`/edit/${car.id}`} className="btn btn-primary">Edit Car</Link>
          <button 
            onClick={handleDelete}
            disabled={deleting}
            className="btn btn-danger"
          >
            {deleting ? 'Deleting...' : 'Delete Car'}
          </button>
        </div>
      </div>

      <div className="car-details-page">
        <div className="car-visual-large">
          <div className="car-preview-large">
            <div 
              className="car-body-large" 
              style={{ backgroundColor: getColorFromName(car.exterior_name) }}
            ></div>
            <div className="car-wheels-large"></div>
          </div>
        </div>

        <div className="car-info-detailed">
          <h1>{car.name}</h1>
          
          <div className="car-specifications">
            <h3>Specifications</h3>
            <div className="specs-grid">
              <div className="spec-item">
                <h4>Exterior Color</h4>
                <div className="spec-value">
                  <div 
                    className="color-swatch" 
                    style={{ backgroundColor: getColorFromName(car.exterior_name) }}
                  ></div>
                  <span>{car.exterior_name}</span>
                  <span className="price">+{formatPrice(car.exterior_price)}</span>
                </div>
              </div>

              <div className="spec-item">
                <h4>Wheels</h4>
                <div className="spec-value">
                  <div className="wheels-icon">⚙️</div>
                  <span>{car.wheels_name}</span>
                  <span className="price">+{formatPrice(car.wheels_price)}</span>
                </div>
              </div>

              <div className="spec-item">
                <h4>Interior</h4>
                <div className="spec-value">
                  <div className="interior-icon">🪑</div>
                  <span>{car.interior_name}</span>
                  <span className="price">+{formatPrice(car.interior_price)}</span>
                </div>
              </div>

              <div className="spec-item">
                <h4>Engine</h4>
                <div className="spec-value">
                  <div className="engine-icon">🔧</div>
                  <span>{car.engine_name}</span>
                  <span className="price">+{formatPrice(car.engine_price)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="price-breakdown">
            <h3>Price Breakdown</h3>
            <div className="price-item">
              <span>Base Price</span>
              <span>{formatPrice(25000)}</span>
            </div>
            <div className="price-item">
              <span>Exterior: {car.exterior_name}</span>
              <span>+{formatPrice(car.exterior_price)}</span>
            </div>
            <div className="price-item">
              <span>Wheels: {car.wheels_name}</span>
              <span>+{formatPrice(car.wheels_price)}</span>
            </div>
            <div className="price-item">
              <span>Interior: {car.interior_name}</span>
              <span>+{formatPrice(car.interior_price)}</span>
            </div>
            <div className="price-item">
              <span>Engine: {car.engine_name}</span>
              <span>+{formatPrice(car.engine_price)}</span>
            </div>
            <hr />
            <div className="price-item total">
              <span><strong>Total Price</strong></span>
              <span><strong>{formatPrice(car.total_price)}</strong></span>
            </div>
          </div>

          <div className="car-meta">
            <p><strong>Created:</strong> {new Date(car.created_at).toLocaleDateString()}</p>
            {car.updated_at !== car.created_at && (
              <p><strong>Last Updated:</strong> {new Date(car.updated_at).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetails