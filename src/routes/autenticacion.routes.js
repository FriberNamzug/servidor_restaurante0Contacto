import {Router} from 'express'
import * as autenticacion from '../controllers/autenticacion.controller'

const router = Router()

router.post('/signup', autenticacion.registrarse)

router.post('/signin', autenticacion.inicioSesion)

export default router