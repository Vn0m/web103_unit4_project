import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllCars, deleteCar } from '../services/CarsAPI'
import { formatPrice } from '../utilities/priceCalculator'
import '../App.css'

const ViewCars = () => {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    loadCars()
  }, [])

  const loadCars = async () => {
    try {
      const data = await getAllCars()
      setCars(data)
    } catch (error) {
      console.error('Error loading cars:', error)
      setError('Failed to load cars')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this car?')) {
      return
    }

    setDeletingId(id)
    try {
      await deleteCar(id)
      setCars(cars.filter(car => car.id !== id))
    } catch (error) {
      console.error('Error deleting car:', error)
      setError('Failed to delete car')
    } finally {
      setDeletingId(null)
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
        <h2>Loading your custom cars...</h2>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>Your Custom Cars</h2>
        <Link to="/" className="btn btn-primary">Create New Car</Link>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {cars.length === 0 ? (
        <div className="empty-state">
          <h3>No custom cars yet</h3>
          <p>Create your first custom car to get started!</p>
          <Link to="/" className="btn btn-primary">Create Your First Car</Link>
        </div>
      ) : (
        <div className="cars-grid">
          {cars.map(car => (
            <div key={car.id} className="car-card">
              <div className="car-preview">
                <div className="car-visual">
                  <div 
                    className="car-body" 
                    style={{ backgroundColor: getColorFromName(car.exterior_name) }}
                  ></div>
                  <div className="car-wheels"></div>
                </div>
              </div>
              
              <div className="car-info">
                <h3>{car.name}</h3>
                <div className="car-specs">
                  <p><strong>Exterior:</strong> {car.exterior_name}</p>
                  <p><strong>Wheels:</strong> {car.wheels_name}</p>
                  <p><strong>Interior:</strong> {car.interior_name}</p>
                  <p><strong>Engine:</strong> {car.engine_name}</p>
                </div>
                <div className="car-price">
                  <h4>{formatPrice(car.total_price)}</h4>
                </div>
                <div className="car-actions">
                  <Link to={`/customcars/${car.id}`} className="btn btn-secondary">
                    View Details
                  </Link>
                  <Link to={`/edit/${car.id}`} className="btn btn-outline">
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(car.id)}
                    disabled={deletingId === car.id}
                    className="btn btn-danger"
                  >
                    {deletingId === car.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ViewCars