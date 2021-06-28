import {Router} from 'express'
import * as productosController from '../controllers/productos.controller'

const router = Router()

router.get('/', productosController.obtenerProductos)

router.post('/', productosController.crearProducto)

router.get('/:productoId', productosController.obtenerProducto)

router.put('/:productoId', productosController.actualizarProducto)

router.delete('/:productoId', productosController.eliminarProducto)


export default router