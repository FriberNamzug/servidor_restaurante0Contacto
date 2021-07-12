import Usuario from "../models/usuario.model"
import jwt from "jsonwebtoken"
import configToken from "../config/token";

export const actualizarUsuario = async (req,res) => {

    try {

        const usuarioId = req.params.usuarioId
        const {nombre, apellido, email, edad, telefono, recibirPromociones, carrito} = req.body
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




/* SUBIR/ACTUALIZAR IMAGEN DE PERFIL DE USUARIO */

export const subirImagenPerfil = async (req,res)=>{

    try {
        
        const usuarioId = req.params.usuarioId

        let usuario = await Usuario.findById(usuarioId)
        /*  
        validamos si es que se envia una id correcta
        */
        if(usuario === null) return res.status(400).json({message:"No encontramos el usuario buscado"})

        usuario.imgPerfil = req.file.path 
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
    
        const usuario = await Usuario.findById(usuarioId).populate('carrito')
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


/* 

Controllers de los carritos xd

*/
export const agregarProductoCarrito = async (req,res)=>{
        try {
            const{productoId, usuarioId} = req.body
            /* faltan hacer algunas validaciones con los datos recibidos */         

            const productoAgregado = await Usuario.findByIdAndUpdate(usuarioId, {'$addToSet':{'carrito':productoId}}, {
                new:true
            }).populate('carrito')
            
            res.status(200).json({
                message: "Se agrego de forma exitosa el producto al carrito",
                productoAgregado
            })

        
        } catch (error) {
            res.status(500).json({
                message: "Ocurrio un error en el servidor",
                error,
             })
             console.log(`Ocurrio un error en el servidor: ${error})`)
          
        }
        
}

/* Este eliminara el producto buscado del carrito */

export const eliminarProductoCarrito = async (req,res)=>{
    try {

        const{productoId, usuarioId} = req.body

/* se debe validar que el producto exista para evitar errores de servidor */

            const productoEliminado = await Usuario.findByIdAndUpdate(usuarioId, {'$pull':{'carrito':productoId}}, {
                new:true
            }).populate('carrito')
/*           
.update({"_id": ObjectId("60e37a89bdf4a100464c3f7c")},{$pull:{"carrito": ObjectId("60e484e3a22bcb4f402855bd")}})
con esta funciona desde mongodb //aqui no es necesario colocar el ObjecId
*/
            res.status(200).json({
                message: "Se elimino de forma exitosa el producto del carrito",
                productoEliminado
                        })

    
    } catch (error) {
        res.status(500).json({
            message: "Ocurrio un error en el servidor",
            error,
         })
         console.log(`Ocurrio un error en el servidor: ${error})`)
      
    }
    
    }