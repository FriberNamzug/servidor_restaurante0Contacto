import Usuario from "../models/usuario.model"

export const obtenerMensaje = async (req,res)=>{

    try {

        const { emisorId, receptorId } = req.body
      const usuario = await Usuario.find({'_id':emisorId, 'chat.id': receptorId},{'chat':1,'_id':0, })

        if(!usuario) return res.status(400).json({message:"No encontramos al usuario en la database"})
        
        res.json({
            message: "Se han obtenido los mensajes de forma correcta",
            mensajesObtenidos: usuario
        })




    } catch (error) {
        res.status(500).json({
            message: "Ocurrio un error en el servidor",
            error,
         })
         console.log(`Ocurrio un error en el servidor: ${error})`)
    }
}

