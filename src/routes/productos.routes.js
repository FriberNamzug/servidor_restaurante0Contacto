import {Router} from 'express'
import * as productosController from '../controllers/productos.controller'
import {verifyToken} from '../middlewares'
import {uploadProducto} from '../middlewares'

const router = Router()

router.get('/', productosController.obtenerProductos)

router.post('/', verifyToken ,productosController.crearProducto)

router.get('/:productoId', productosController.obtenerProducto)

router.put('/:productoId', productosController.actualizarProducto)

router.delete('/:productoId', productosController.eliminarProducto)

router.put('/upload/:productoId', uploadProducto.single('imagen'), productosController.actualizarImagenProducto)

export default router  