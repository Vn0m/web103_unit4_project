import { pool } from '../config/database.js'

export const getAllCars = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        cc.*,
        ext.name as exterior_name, ext.price as exterior_price, ext.image_url as exterior_image,
        wh.name as wheels_name, wh.price as wheels_price, wh.image_url as wheels_image,
        int.name as interior_name, int.price as interior_price, int.image_url as interior_image,
        eng.name as engine_name, eng.price as engine_price, eng.image_url as engine_image
      FROM custom_cars cc
      LEFT JOIN car_options ext ON cc.exterior_color_id = ext.id
      LEFT JOIN car_options wh ON cc.wheels_id = wh.id
      LEFT JOIN car_options int ON cc.interior_id = int.id
      LEFT JOIN car_options eng ON cc.engine_id = eng.id
      ORDER BY cc.created_at DESC
    `)
    res.json(result.rows)
  } catch (error) {
    console.error('Error getting all cars:', error)
    res.status(500).json({ error: 'Failed to get cars' })
  }
}

export const getCarById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(`
      SELECT 
        cc.*,
        ext.name as exterior_name, ext.price as exterior_price, ext.image_url as exterior_image,
        wh.name as wheels_name, wh.price as wheels_price, wh.image_url as wheels_image,
        int.name as interior_name, int.price as interior_price, int.image_url as interior_image,
        eng.name as engine_name, eng.price as engine_price, eng.image_url as engine_image
      FROM custom_cars cc
      LEFT JOIN car_options ext ON cc.exterior_color_id = ext.id
      LEFT JOIN car_options wh ON cc.wheels_id = wh.id
      LEFT JOIN car_options int ON cc.interior_id = int.id
      LEFT JOIN car_options eng ON cc.engine_id = eng.id
      WHERE cc.id = $1
    `, [id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Car not found' })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('Error getting car by ID:', error)
    res.status(500).json({ error: 'Failed to get car' })
  }
}

export const createCar = async (req, res) => {
  try {
    const { name, exterior_color_id, wheels_id, interior_id, engine_id, total_price } = req.body
    
    if (!name || !exterior_color_id || !wheels_id || !interior_id || !engine_id || total_price === undefined) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    const optionIds = [exterior_color_id, wheels_id, interior_id, engine_id]
    const optionCheck = await pool.query(`
      SELECT id FROM car_options WHERE id = ANY($1)
    `, [optionIds])
    
    if (optionCheck.rows.length !== optionIds.length) {
      return res.status(400).json({ error: 'One or more option IDs are invalid' })
    }
    
    const result = await pool.query(`
      INSERT INTO custom_cars (name, exterior_color_id, wheels_id, interior_id, engine_id, total_price)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [name, exterior_color_id, wheels_id, interior_id, engine_id, total_price])
    
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error creating car:', error)
    res.status(500).json({ error: 'Failed to create car' })
  }
}

export const updateCar = async (req, res) => {
  try {
    const { id } = req.params
    const { name, exterior_color_id, wheels_id, interior_id, engine_id, total_price } = req.body
    
    if (!name || !exterior_color_id || !wheels_id || !interior_id || !engine_id || total_price === undefined) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    
    const optionIds = [exterior_color_id, wheels_id, interior_id, engine_id]
    const optionCheck = await pool.query(`
      SELECT id FROM car_options WHERE id = ANY($1)
    `, [optionIds])
    
    if (optionCheck.rows.length !== optionIds.length) {
      return res.status(400).json({ error: 'One or more option IDs are invalid' })
    }
    
    const result = await pool.query(`
      UPDATE custom_cars 
      SET name = $1, exterior_color_id = $2, wheels_id = $3, interior_id = $4, engine_id = $5, total_price = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `, [name, exterior_color_id, wheels_id, interior_id, engine_id, total_price, id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Car not found' })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('Error updating car:', error)
    res.status(500).json({ error: 'Failed to update car' })
  }
}

export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params
    
    const result = await pool.query(`
      DELETE FROM custom_cars WHERE id = $1 RETURNING *
    `, [id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Car not found' })
    }
    
    res.json({ message: 'Car deleted successfully' })
  } catch (error) {
    console.error('Error deleting car:', error)
    res.status(500).json({ error: 'Failed to delete car' })
  }
}
