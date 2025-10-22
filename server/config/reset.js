import { pool } from './database.js'
import dotenv from 'dotenv'

dotenv.config()

const resetDatabase = async () => {
  try {
    await pool.query(`
      DROP TABLE IF EXISTS custom_cars CASCADE;
      DROP TABLE IF EXISTS car_options CASCADE;
    `)

    await pool.query(`
      CREATE TABLE car_options (
        id SERIAL PRIMARY KEY,
        category VARCHAR(50) NOT NULL,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) DEFAULT 0,
        image_url VARCHAR(255),
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await pool.query(`
      CREATE TABLE custom_cars (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        exterior_color_id INTEGER REFERENCES car_options(id),
        wheels_id INTEGER REFERENCES car_options(id),
        interior_id INTEGER REFERENCES car_options(id),
        engine_id INTEGER REFERENCES car_options(id),
        total_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await pool.query(`
      INSERT INTO car_options (category, name, price, image_url, is_default) VALUES
      -- Exterior Colors
      ('exterior', 'Classic Red', 0, '/images/exterior-red.png', true),
      ('exterior', 'Electric Blue', 500, '/images/exterior-blue.png', false),
      ('exterior', 'Midnight Black', 750, '/images/exterior-black.png', false),
      ('exterior', 'Pearl White', 1000, '/images/exterior-white.png', false),
      ('exterior', 'Racing Green', 600, '/images/exterior-green.png', false),
      
      -- Wheels
      ('wheels', 'Standard Alloy', 0, '/images/wheels-standard.png', true),
      ('wheels', 'Sport Rims', 1200, '/images/wheels-sport.png', false),
      ('wheels', 'Carbon Fiber', 2500, '/images/wheels-carbon.png', false),
      ('wheels', 'Chrome Spinners', 1800, '/images/wheels-chrome.png', false),
      
      -- Interior
      ('interior', 'Cloth Seats', 0, '/images/interior-cloth.png', true),
      ('interior', 'Leather Seats', 2000, '/images/interior-leather.png', false),
      ('interior', 'Racing Seats', 1500, '/images/interior-racing.png', false),
      ('interior', 'Premium Leather', 3500, '/images/interior-premium.png', false),
      
      -- Engine
      ('engine', 'Standard Engine', 0, '/images/engine-standard.png', true),
      ('engine', 'Turbo Engine', 5000, '/images/engine-turbo.png', false),
      ('engine', 'V8 Engine', 8000, '/images/engine-v8.png', false),
      ('engine', 'Electric Motor', 12000, '/images/engine-electric.png', false)
    `)

    console.log('Database reset successfully!')
  } catch (error) {
    console.error('Error resetting database:', error)
  } finally {
    await pool.end()
  }
}

resetDatabase()
