import {Router} from 'express'
import * as pagoController from '../controllers/pago.controller'

const router = Router()

router.post('/create/', pagoController.create_preferences)
router.get('/feedback', pagoController.feedback)


export default router