import {Router} from 'express'
import * as carritoController from '../controllers/carrito.controller.js'
import {upload} from '../middlewares'

const router = Router()


router.post('/agregar/', carritoController.agregarProductoCarrito)
router.post('/eliminar/', carritoController.eliminarProductoCarrito)
router.get('/obtener/:usuarioId', carritoController.obtenerProductoCarrito)


router.post('/savepedido/', carritoController.savePedido)
router.put('/statuspedido/', carritoController.statusPedido)


/*
router.delete('/:productoId', carritoController.eliminarProducto)
 */


export default router