import * as chatController from '../controllers/chat.controller'
import Usuario from "../models/usuario.model"


export const conexion =  (socket)=>{   
    try {

        const idHandShake = socket.id
        const { nameRoom } = socket.handshake.query
        socket.join(nameRoom)
        
        console.log(`Hola dispositivo: ${idHandShake} Se unio a ${nameRoom}`);
        
        
        socket.on("sendMessage", async (res)  =>  {
        
        console.log(`Mensaje: ${res.mensaje}  Emisor: ${res.emisorId}  Receptor: ${res.receptorId} `)

        socket.to(nameRoom).emit("reveiceMessage",res)

        const usuarioEmisor =  Usuario.findById(res.emisorId).populate('chat')
        const usuarioReceptor =  Usuario.findById(res.receptorId).populate('chat')

        if(!usuarioEmisor) return res.status(400).json({message:"No encontramos el usuario buscado"})
        if(!usuarioReceptor) return res.status(400).json({message:"No encontramos el usuario buscado"})

        await Usuario.findByIdAndUpdate(res.emisorId, {'$addToSet':{'chat':{'mensaje':res.mensaje, 'id':res.emisorId, 'mensajeType':true}}},{new:true}).populate('chat')
        await Usuario.findByIdAndUpdate(res.receptorId, {'$addToSet':{'chat':{'mensaje':res.mensaje, 'id':res.receptorId, 'mensajeType':false}}},{new:true}).populate('chat')
       

        console.log("Se almaceno de forma correcta el mensaje")


            })  

    } catch (error) {
        res.status(500).json({
            message: "Ocurrio un error en el servidor",
            error,
         })
         console.log(`Ocurrio un error en el servidor: ${error})`)
    }
    










    

}
  