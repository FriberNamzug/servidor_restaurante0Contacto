import {Router} from 'express'
import * as usuarioController from '../controllers/usuarios.controller'
import {upload} from '../middlewares'

const router = Router()
/* consultas */
router.get('/', usuarioController.obtenerUsuarios)
router.get('/clientes/', usuarioController.obtenerClientes)
router.get('/empleados/', usuarioController.obtenerEmpleados)
router.get('/empleados/deshabilitado/', usuarioController.obtenerEmpleadosDeshabilitados)
router.get('/clientes/deshabilitado/', usuarioController.obtenerClientesDeshabilitados)

router.get('/:usuarioId', usuarioController.obtenerUsuario)

/* ------------------ */
router.delete('/:usuarioId', usuarioController.deshabilitarUsuarioClienteEmpleado)
router.put('/habilitar/:usuarioId', usuarioController.habilitarClienteEmpleado)


/* mover a autenticacion ----> */
router.put('/cambioderol/:usuarioId', usuarioController.cambiarRol)
router.post('/', usuarioController.crearEmpleado)
router.put('/:usuarioId', usuarioController.actualizarUsuario)
router.put('/upload/:usuarioId', upload.single('imagen'), usuarioController.subirImagenPerfil)
router.put('/password/:usuarioId', usuarioController.actualizarPassword)

/* 
////////////////////////////////////////////////////////////////
*/


export default router