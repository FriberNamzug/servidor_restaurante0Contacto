import Usuario from "../models/usuario.model"
import Producto from '../models/producto.model'

import jwt from "jsonwebtoken"
import configToken from "../config/token";

/*

Actualizamos el password

*/

export const actualizarPassword = async (req,res)=>{

    try {

const usuarioId = req.params.usuarioId
const {nuevaPassword, viejaPassword} = req.body

//Validamos que el usuario exista
let usuarioEncontrado = await Usuario.findById(usuarioId)
if(!usuarioEncontrado) return res.status(400).json({message:"No encontramos el usuario buscado"})
if(usuarioEncontrado.deshabilitado === true) return res.status(400).json({message:"Usuario Deshabilitado"})

const passwordEmparejada = await Usuario.compararPassword(viejaPassword, usuarioEncontrado.password)
//Validamos que la password que se trae sea correcta
if(!passwordEmparejada) return res.status(401).json({message:"Contraseña invalida"})
//encriptamos
const NuevaPasswordEncriptada = await Usuario.encryptPassword(nuevaPassword)
//guardamos en una const usuario para actualizar
const usuario = {
    password: NuevaPasswordEncriptada
}

    await Usuario.findByIdAndUpdate(usuarioId, usuario, {
    new:true
})


console.log('Password Actualizada'+ NuevaPasswordEncriptada)

res.status(200).json({
    message: "Se actualizo de forma exitosa el password"
})




    } catch (error) {
        res.status(500).json({
            message: "Ocurrio un error en el servidor",
            error,
         })
         console.log(`Ocurrio un error en el servidor: ${error})`)
    }

}

/*


ACTUALIZAMOS EL USUARIO


*/

export const actualizarUsuario = async (req,res) => {

    try {

        const usuarioId = req.params.usuarioId
        const {nombre, apellido, email, edad, telefono, recibirPromociones, carrito} = req.body

        let usuario = await Usuario.findById(usuarioId)
        if(!usuario) return res.status(400).json({message:"No encontramos el usuario buscado"})
        if(usuario.deshabilitado===true) return res.status(400).json({message:"Usuario Deshabilitado"})

        usuario.nombre   = nombre
        usuario.apellido = apellido
        usuario.email    = email
        usuario.edad     = edad
        usuario.telefono = telefono
        usuario.recibirPromociones = recibirPromociones
        usuario.carrito = carrito

        const usuarioActualizado = await Usuario.findByIdAndUpdate(usuarioId, usuario, {
            new:true
        }).populate('carrito')

        res.status(200).json({
            message: "Se actualizo de forma exitosa el usuario",
            datosActualizados: {
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                edad: usuario.edad ,
                telefono: usuario.telefono,
                recibirPromociones: usuario.recibirPromociones,
                carrito: usuario.carrito,
                imgPerfil: usuario.imgPerfil
            }
        })


    } catch (error) {
        res.status(500).json({
            message: "Ocurrio un error en el servidor",
            error,
         })
         console.log(`Ocurrio un error en el servidor: ${error})`)
    }

}




/*


SUBIR/ACTUALIZAR IMAGEN DE PERFIL DE USUARIO


*/

export const subirImagenPerfil = async (req,res)=>{

    try {

        const usuarioId = req.params.usuarioId

        let usuario = await Usuario.findById(usuarioId)

        if(!usuario) return res.status(400).json({message:"No encontramos el usuario buscado"})
        if(usuario.deshabilitado===true) return res.status(400).json({message:"Usuario Deshabilitado"})

       let  url = req.file.path

        usuario.imgPerfil = `${url.substr(7,6)}/${url.substr(14,9)}/${url.substr(24)}`


        const usuarioActualizado = await Usuario.findByIdAndUpdate(usuarioId, usuario, {
            new:true
        })
        res.status(200).json({
            message:'Se subio de forma exitosa',
            rutaImg: usuario.imgPerfil
        })
    } catch (error) {
        console.error('Error del servidor :(',error)
    }

}



/*


OBTENER LOS USUARIOS


*/
export const obtenerUsuarios = async (req,res)=>{

    try {
        const usuarios = await Usuario.find({"deshabilitado":false})

        console.log(usuarios)
        if(!usuarios) return res.status(400).json({message:"No encontramos usuarios en la database"})

        res.json({
            message: "Se han obtenido los usuarios de forma correcta",
            usuarios
        })


    } catch (error) {
        res.status(500).json({
            message: "Ocurrio un error en el servidor",
            error,
         })
         console.log(`Ocurrio un error en el servidor: ${error})`)
    }



}





/*


Obtener un solo usuario


*/

export const obtenerUsuario = async (req,res)=>{
    try {

      const usuarioId = req.params.usuarioId

        const usuario = await Usuario.findById(usuarioId).populate('carrito')
        if(!usuario) return res.status(400).json({message:"No encontramos el usuario buscado"})
        if(usuario.deshabilitado === true) return res.status(400).json({message:"Usuario Deshabilitado"})

        res.status(200).json({
            message: "Se ha obtenido el usuario de forma correcta",
            usuario
        })

        console.log(usuario)


    } catch (error) {
        res.status(500).json({
            message: "Ocurrio un error en el servidor",
            error,
         })
         console.log(`Ocurrio un error en el servidor: ${error})`)

    }

    }







/*

Agrega producto al carrito

*/
export const agregarProductoCarrito = async (req,res)=>{
        try {
            const{productoId, usuarioId} = req.body

            let usuarioEncontrado = await Usuario.findById(usuarioId)
            if(!usuarioEncontrado) return res.status(400).json({message:"No encontramos el usuario solicitado"})
            if(usuarioEncontrado.deshabilitado === true) return res.status(400).json({message:"Usuario Deshabilitado"})

            let productoEncontrado = await Producto.findById(productoId)
            if(!productoEncontrado) return res.status(400).json({message:"No encontramos el producto solicitado"})


                                                                            //Se cambio el $addToSet ya que este solo agrega si no existe
            const productoAgregado = await Usuario.findByIdAndUpdate(usuarioId, {'$addToSet':{
                                                                                    'carrito':{
                                                                                        'nombre':productoEncontrado.nombre,
                                                                                        'descripcion':productoEncontrado.descripcion,
                                                                                        'categoria':productoEncontrado.categoria,
                                                                                        'precio':productoEncontrado.precio,
                                                                                        'imagenUrl':productoEncontrado.imagenUrl,

                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                new:true
                                                                            }).populate('carrito')

            res.status(200).json({
                message: `Se agrego de forma exitosa el producto '${productoEncontrado.nombre}' al carrito`,
                producto: productoEncontrado.nombre
            })


        } catch (error) {
            res.status(500).json({
                message: "Ocurrio un error en el servidor",
                error,
             })
             console.log(`Ocurrio un error en el servidor: ${error})`)

        }

}


/*


Este eliminara el producto buscado del carrito


*/

export const eliminarProductoCarrito = async (req,res)=>{
    try {

        const{productoId, usuarioId} = req.body

        let usuarioEncontrado = await Usuario.find({'_id': usuarioId, 'carrito._id':productoId})
        if(!usuarioEncontrado) return res.status(400).json({message:"No encontramos el usuario solicitado o el producto a quitar del carrito"})

            const productoEliminado = await Usuario.findByIdAndUpdate(usuarioId, {'$pull':{'carrito':{'_id':productoId}}}, {
                new:true
            }).populate('carrito')
/*
db.getCollection('usuarios').find({"_id": ObjectId("60f4a51a995e0344d835549d"), "carrito._id": ObjectId("60f4a603e6921959e85b5979")})
///
.update({"_id": ObjectId("60e37a89bdf4a100464c3f7c")},{$pull:{"carrito": ObjectId("60e484e3a22bcb4f402855bd")}})
con esta funciona desde mongodb //aqui no es necesario colocar el ObjecId
*/
            res.status(200).json({
                message: "Se elimino de forma exitosa el producto del carrito",
                        })
    } catch (error) {
        res.status(500).json({
            message: "Ocurrio un error en el servidor",
            error,
         })
         console.log(`Ocurrio un error en el servidor: ${error})`)
    }
}



/*

OBTENER CLIENTES

*/


export const obtenerClientes = async (req,res)=>{

    try {
      const usuarios = await Usuario.find({'rol':'cliente','deshabilitado':false})
        if(!usuarios) return res.status(400).json({message:"No encontramos clientes en la database"})
        res.json({
            message: "Se han obtenido los usuarios de forma correcta",
            usuarios
        })
    } catch (error) {
        res.status(500).json({
            message: "Ocurrio un error en el servidor",
            error,
         })
         console.log(`Ocurrio un error en el servidor: ${error})`)
    }
}

/*

OBTENER EMPLEADOS

*/


export const obtenerEmpleados = async (req,res)=>{
    try {
        const usuarios = await Usuario.find({'rol':'empleado','deshabilitado':false})
        if(!usuarios) return res.status(400).json({message:"No encontramos empleados en la database"})
        res.json({
            message: "Se han obtenido los usuarios de forma correcta",
            usuarios
        })
    } catch (error) {
        res.status(500).json({
            message: "Ocurrio un error en el servidor",
            error,
         })
         console.log(`Ocurrio un error en el servidor: ${error})`)
    }
}


/* 

eliminamos el usuario(solo deberia poderlo hacer el administrador faltan validaciones de token)

*/

export const eliminarUsuarioClienteEmpleado = async (req,res)=>{

    try {

        
        const usuarioId = req.params.usuarioId

        const usuario = await Usuario.findById(usuarioId)
        
        if(!usuario) return res.status(400).json({message:"No encontramos el usuario o este es administrador"})
        if(usuario.rol === "administrador") return res.status(400).json({message:"El usuario encontrado no se puede eliminar ya que es administrador"})
        if(usuario.deshabilitado === true) return res.status(400).json({message:"El usuario ya se encuentra deshabilitado"})

        const usuarioActualizado = await Usuario.findByIdAndUpdate(usuarioId, {deshabilitado: true}, {
            new:true
        })
        //await Usuario.findByIdAndRemove(usuarioId)
        res.status(200).json({
            message: "Se deshabilito de forma correcta el usuario "+ usuarioActualizado.nombre + "Si deseas habilitarlo contacta al administrador",
        }) 
        
    } catch (error) {

        res.status(500).json({
            message: "Ocurrio un error en el servidor",
            error,
         })
         console.log(`Ocurrio un error en el servidor: ${error})`)

    }



}