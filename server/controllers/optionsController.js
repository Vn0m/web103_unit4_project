import { pool } from '../config/database.js'

export const getOptionsByCategory = async (req, res) => {
  try {
    const { category } = req.params
    const result = await pool.query(`
      SELECT * FROM car_options 
      WHERE category = $1 
      ORDER BY is_default DESC, price ASC
    `, [category])
    
    res.json(result.rows)
  } catch (error) {
    console.error('Error getting options by category:', error)
    res.status(500).json({ error: 'Failed to get options' })
  }
}

export const getAllOptions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM car_options 
      ORDER BY category, is_default DESC, price ASC
    `)
    
    const optionsByCategory = result.rows.reduce((acc, option) => {
      if (!acc[option.category]) {
        acc[option.category] = []
      }
      acc[option.category].push(option)
      return acc
    }, {})
    
    res.json(optionsByCategory)
  } catch (error) {
    console.error('Error getting all options:', error)
    res.status(500).json({ error: 'Failed to get options' })
  }
}

export const getOptionById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(`
      SELECT * FROM car_options WHERE id = $1
    `, [id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Option not found' })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('Error getting option by ID:', error)
    res.status(500).json({ error: 'Failed to get option' })
  }
}
