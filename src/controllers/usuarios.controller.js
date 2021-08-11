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

        let usuario = await Usuario.findById(usuarioId,)
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

        let usuario = await Usuario.findById(usuarioId,{password:false})

        if(!usuario) return res.status(400).json({message:"No encontramos el usuario buscado"})
        if(usuario.deshabilitado===true) return res.status(400).json({message:"Usuario Deshabilitado"})
        if(req.file.path === undefined) return res.status(400).json({message:"No se envio imagen, intentalo de nuevo, si el problema persiste contactanos."})
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
        const usuarios = await Usuario.find({"deshabilitado":false},{password:false})

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

        const usuario = await Usuario.findById(usuarioId,{password:false}).populate('carrito')
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

OBTENER CLIENTES

*/


export const obtenerClientes = async (req,res)=>{

    try {
      const usuarios = await Usuario.find({'rol':'cliente','deshabilitado':false},{password:false})
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
        const usuarios = await Usuario.find({'rol':'empleado','deshabilitado':false},{password:false})
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

export const deshabilitarUsuarioClienteEmpleado = async (req,res)=>{

    try {

        
        const usuarioId = req.params.usuarioId

        const usuario = await Usuario.findById(usuarioId,{password:false})
        
        if(!usuario) return res.status(400).json({message:"No encontramos el usuario o este es administrador"})
        if(usuario.rol === "administrador") return res.status(400).json({message:"El usuario encontrado no se puede eliminar ya que es administrador"})
        if(usuario.deshabilitado === true) return res.status(400).json({message:"El usuario ya se encuentra deshabilitado"})

        const usuarioActualizado = await Usuario.findByIdAndUpdate(usuarioId, {deshabilitado: true}, {
            new:true
        })
        //await Usuario.findByIdAndRemove(usuarioId)
        res.status(200).json({
            message: "Se deshabilito de forma correcta el usuario "+ usuarioActualizado.nombre + ", Si deseas habilitarlo contacta al administrador",
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

HabilitarCliente

*/


export const habilitarClienteEmpleado = async (req,res)=>{

    try {

        
        const usuarioId = req.params.usuarioId

        const usuario = await Usuario.find({'_id': usuarioId, 'deshabilitado':true},{password:false})
        
        if(!usuario) return res.status(400).json({message:"No encontramos el usuario o este es administrador"})
        if(usuario.rol === "administrador") return res.status(400).json({message:"El usuario encontrado no se puede modificar ya que es administrador"})
        if(usuario.deshabilitado === false) return res.status(400).json({message:"El usuario ya se encuentra habilitado"})

        const usuarioActualizado = await Usuario.findByIdAndUpdate(usuarioId, {deshabilitado: false}, {
            new:true
        })

        res.status(200).json({
            message: "Se habilito de forma correcta el usuario "+ usuarioActualizado.nombre,
        }) 
        
    } catch (error) {

        res.status(500).json({
            message: "Ocurrio un error en el servidor",
            error,
         })
         console.log(`Ocurrio un error en el servidor: ${error})`)

    }



}



export const obtenerClientesDeshabilitados = async (req,res)=>{

    try {

        const usuarios = await Usuario.find({'rol':'cliente','deshabilitado':true},{password:false})
        
        if(usuarios.length === 0) return res.status(400).json({message:"No encontramos clientes deshabilitados en la database"})
        //if(!usuarios) return res.status(400).json({message:"No encontramos clientes en la database"})

        res.json({
            message: "Se han obtenido los clientes de forma correcta",
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

Obtener empleados Deshabilitados

*/

export const obtenerEmpleadosDeshabilitados = async (req,res)=>{

    try {

        const usuarios = await Usuario.find({'rol':'empleado','deshabilitado':true},{password:false})
        if(usuarios.length === 0) return res.status(400).json({message:"No encontramos empleados deshabilitados en la database"})
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

CrearEmpleado

*/

export const crearEmpleado = async (req,res)=>{

    try {
        
        const{nombre, apellido, edad, telefono, email, password } = req.body

        const UsuarioExistente = await Usuario.findOne({email},{password:false})

        if(UsuarioExistente){
            return res.status(400).json({
                message: `E-Mail en uso ${email}, para el usuario ${nombre} ${apellido}, Te recomendamos actualizar su rol de cliente a empleado y/o registrar un correo distinto.`
            })
        }

     

        const nuevoUsuario = new Usuario({
            nombre,
            apellido,
            edad,
            telefono,
            email,
            rol: "empleado",
            password: await Usuario.encryptPassword(password),
            terminosCondiciones: true,
            imgPerfil: "upload/imgPerfil/meseroPerfil.png",
            statusLaboral: "Descanso",

        })
        const usuarioGuardado =  await nuevoUsuario.save()

        res.status(201).json({
            message: "Usuario creado con exito",
            usuarioGuardado
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

ACTUALIZAR ROL

*/


export const cambiarRol = async (req,res)=>{

    try {
        const usuarioId = req.params.usuarioId
        const {rolEnviado} = req.body

        const usuario = await Usuario.findById(usuarioId,{password:false})
        
        if(!usuario) return res.status(400).json({message:"No encontramos el usuario"})
        if(usuario.rol === "administrador") return res.status(400).json({message:"El usuario encontrado puede cambiar de rol ya que es administrador"})
        if(usuario.deshabilitado === true) return res.status(400).json({message:"El usuario se encuentra deshabilitado"})
        if(rolEnviado === "administrador") return res.status(400).json({message:"No se puede asignar el rol Administrador"})
        if(rolEnviado === "cliente"){
            const usuarioActualizado = await Usuario.findByIdAndUpdate(usuarioId, {rol: rolEnviado}, {
                new:true
            })
            res.status(200).json({
                message: `Se actualizo el rol de ${usuario.rol} a '${usuarioActualizado.rol}' del usuario ${usuario.nombre} de forma exitosa!`,
            }) 

        }if(rolEnviado ==="empleado"){
            const usuarioActualizado = await Usuario.findByIdAndUpdate(usuarioId, {rol: rolEnviado}, {
                new:true
            })
            res.status(200).json({
                message: `Se actualizo el rol de ${usuario.rol} a '${usuarioActualizado.rol}' del usuario ${usuario.nombre} de forma exitosa!`,
            }) 

        }else{
            return res.status(400).json({message:"No se puede asignar un rol que no sea empleado o cliente"})
        }

        
    } catch (error) {

        res.status(500).json({
            message: "Ocurrio un error en el servidor",
            error,
         })
         console.log(`Ocurrio un error en el servidor: ${error})`)

    }


}