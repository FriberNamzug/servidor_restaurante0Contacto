import Usuario from "../models/usuario.model"
import jwt from "jsonwebtoken"
import configToken from "../config/token";
import RolesModel from "../models/roles.model";

//////////////////////////////////////////////////////
/// Ruta para registrar un usuario
///////////////////////////////////////////////////
export const registrarse = async (req,res) => {
  
   try {
       
       const {username,email,password,roles} = req.body
    
       //validara validar si existe usuario
    const UsuarioExistente = Usuario.find({email})
    /////////////////////////////////////////////////
    
       const nuevoUsuario = new Usuario({
           username,
           email,
           password: await Usuario.encryptPassword(password)
       })
    
       
    //////////////////////////////////////////////////
       /* Roles a validar */ //PENDIENTE
    //////////////////////////////////////////////////
    if(roles){
       const rolesEncontrado = await RolesModel.find({nombre: {$in: roles}})
       nuevoUsuario.roles = rolesEncontrado.map(role => role._id)
    }else{
       const role = await RolesModel.findOne({nombre:"cliente"})
       nuevoUsuario.roles = [role._id]
    }
    

    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
    const usuarioGuardado = await nuevoUsuario.save()
    
    /* Se validara con un token para que el 
    usuario pueda realizar acciones */
    
    const token = jwt.sign({id: usuarioGuardado._id},configToken.SECRET,{
       expiresIn:86400 //eso son 24hrs
    })
    
    
    //Con esto devolvemos un token al usuario para que
    // lo solicite para cada
    //accion que hara en la web
    res.status(200).json({token})
    console.log(usuarioGuardado)




   } catch (error) {

    console.log(`Ocurrio un error inesperado :( ${error})`)
       
   }
   

}









export const inicioSesion = async (req,res) => {

    try {
        
        const {email,password} = req.body
    
        const usuarioEncontrado = await Usuario.findOne({email}).populate("roles")
    
        console.log(usuarioEncontrado)
    
        if(!usuarioEncontrado) return res.status(400).json({message: "Usuario no fue encontrado"})
    
        const passwordEmparejada = await Usuario.compararPassword(password, usuarioEncontrado.password)
        
        if(!passwordEmparejada) return res.status(401).json({token:null, message:"Contraseña invalida"})
      
      
      
      
        console.log(usuarioEncontrado)
        const token = jwt.sign({id:usuarioEncontrado._id},configToken.SECRET,{
            expiresIn:86400
        })
        res.json({token})


    } catch (error) {
        console.log(`Ha ocurrido un error ): ${error}`)
    }



}