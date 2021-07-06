import {Router} from 'express'
import * as usuarioController from '../controllers/usuarios.controller'

const router = Router()

router.get('/', usuarioController.obtenerUsuarios)

router.put('/:usuarioId', usuarioController.actualizarUsuario)

router.get('/:usuarioId', usuarioController.obtenerUsuario)
/*
router.post('/', verifyToken ,productosController.crearProducto)



router.delete('/:productoId', productosController.eliminarProducto) */

export default router