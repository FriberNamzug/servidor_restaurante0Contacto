import Usuario from "../models/usuario.model"
import jwt from "jsonwebtoken"
import configToken from "../config/token";

export const actualizarUsuario = async (req,res) => {

    try {

        const usuarioId = req.params.usuarioId
        const {nombre, apellido, email, edad, telefono, recibirPromociones} = req.body
/*  
validamos si es que se envia una id correcta
*/
        let usuario = await Usuario.findById(usuarioId)
        if(usuario === null) return res.status(400).json({message:"No encontramos el usuario buscado"})
        
        /* despues de validar, enviamos actualizacion con lo que se reciba de body */
        usuario.nombre   = nombre
        usuario.apellido = apellido
        usuario.email    = email
        usuario.edad     = edad
        usuario.telefono = telefono
        usuario.recibirPromociones = recibirPromociones

        const usuarioActualizado = await Usuario.findByIdAndUpdate(usuarioId, usuario, {
            new:true
        })

        res.status(200).json({
            message: "Se actualizo de forma exitosa el usuario",
            datosActualizados: {
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                edad: usuario.edad ,
                telefono: usuario.telefono,
                recibirPromociones: usuario.recibirPromociones,
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


/* OBTENER LOS USUARIOS */
export const obtenerUsuarios = async (req,res)=>{




    try {
        const usuarios = await Usuario.find()

        if(usuarios === null) return res.status(400).json({message:"No encontramos usuarios en la database"})

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





/* Obtener un solo usuario */

export const obtenerUsuario = async (req,res)=>{
    try {

      const usuarioId = req.params.usuarioId
    
        const usuario = await Usuario.findById(usuarioId)
        if(usuario === null) return res.status(400).json({message:"No encontramos el usuario buscado"})
    

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