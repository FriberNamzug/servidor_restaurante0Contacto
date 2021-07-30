import {Router} from 'express'
import * as chatController from '../controllers/chat.controller'

const router = Router()

router.post('/', chatController.obtenerMensaje)


export default router