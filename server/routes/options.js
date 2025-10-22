import express from 'express'
import { getAllOptions, getOptionsByCategory, getOptionById } from '../controllers/optionsController.js'

const router = express.Router()

router.get('/', getAllOptions)
router.get('/category/:category', getOptionsByCategory)
router.get('/:id', getOptionById)

export default router
