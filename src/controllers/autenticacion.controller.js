import Usuario from "../models/usuario.model"
import jwt from "jsonwebtoken"
import configToken from "../config/token";

//////////////////////////////////////////////////////
/// Ruta para registrar un usuario
///////////////////////////////////////////////////
export const registrarse = async (req,res) => {
  
   try {
       
       const {nombre,apellido,edad,telefono,terminosCondiciones,email,password,} = req.body
    
       //validara validar si existe usuario
    const UsuarioExistente = await Usuario.findOne({email})
    
    if(UsuarioExistente){
       return res.status(400).json({
          message: `E-Mail en uso, registrate con otro o inicia sesion con ${email}`
         })
      }

    /////////////////////////////////////////////////
    
       const nuevoUsuario = new Usuario({
         nombre,
         apellido,
         edad,
         telefono,
         email,
         terminosCondiciones,
         password: await Usuario.encryptPassword(password)
       })
    
    const usuarioGuardado = await nuevoUsuario.save()
    
    /* Se validara con un token para que el 
    usuario pueda realizar acciones */
    
    const token = jwt.sign({id: usuarioGuardado._id},configToken.SECRET,{
       expiresIn:86400 //eso son 24hrs
    })
    
    
    //Con esto devolvemos un token al usuario para que
    // lo solicite para cada
    //accion que hara en la web
    res.status(200).json({
      message: "El usuario se creo de forma exitosa",
      token,
      usuario: {
         nombre: nombre,
         apellido: apellido,
         edad: edad,
         telefono: telefono,
         email: email,
         password: "Encryptada y segura!!",
         terminosCondiciones: terminosCondiciones,
         token:token
      }
      })
    console.log(usuarioGuardado)


   } catch (error) {

   res.status(500).json({
      message: "Ocurrio un error en el servidor",
      error,
   })

    console.log(`Ocurrio un error en el servidor: ${error})`)
       
   }
   

}




/* 

INICIAMOS SESION (:

*/




export const inicioSesion = async (req,res) => {

    try {
        
        const {email,password} = req.body
    
        const usuarioEncontrado = await Usuario.findOne({email})
    
        console.log(usuarioEncontrado)
    
        if(!usuarioEncontrado) return res.status(400).json({message: "El E-Mail no se encontro, registrate"})
        if(usuarioEncontrado === true) return res.status(400).json({message: "Usuario Deshabilitado"})
    
        const passwordEmparejada = await Usuario.compararPassword(password, usuarioEncontrado.password)
        
        if(!passwordEmparejada) return res.status(401).json({token:null, message:"Contraseña invalida"})
      
      
      
      
        console.log(usuarioEncontrado)
        const token = jwt.sign({id:usuarioEncontrado._id},configToken.SECRET,{
            expiresIn:86400
        })
        res.json({
         message: 'Se inicio session de forma correcta',
         usuario: {
            usuarioEncontrado
         },
         token
         })


    } catch (error) {

      res.status(500).json({
         message: "Ocurrio un error en el servidor",
         error,
      })
   
       console.log(`Ocurrio un error en el servidor: ${error})`)

   }



}