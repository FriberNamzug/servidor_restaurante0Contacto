import {Router} from 'express'
import * as usuarioController from '../controllers/usuarios.controller'
import {upload} from '../middlewares'

const router = Router()

router.get('/', usuarioController.obtenerUsuarios)

router.put('/:usuarioId', usuarioController.actualizarUsuario)

router.get('/:usuarioId', usuarioController.obtenerUsuario)

router.put('/upload/:usuarioId', upload.single('imagen'), usuarioController.subirImagenPerfil)

router.put('/password/:usuarioId', usuarioController.actualizarPassword)

/* 
////////////////////////////////////////////////////////////////
*/

/* peticiones del carrito usuario */
router.post('/agregar/', usuarioController.agregarProductoCarrito)

router.post('/eliminar/', usuarioController.eliminarProductoCarrito)



/*
router.delete('/:productoId', productosController.eliminarProducto)
 */

export default router