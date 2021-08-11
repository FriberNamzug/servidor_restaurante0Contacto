
import Usuario from "../models/usuario.model"
import Producto from '../models/producto.model'
import mongoose from 'mongoose'


/*


Este eliminara el producto buscado del carrito


*/


export const eliminarProductoCarrito = async (req,res)=>{
    try {

        const{productoId, usuarioId} = req.body

        let usuarioEncontrado = await Usuario.find({'_id': usuarioId, 'carrito._id':productoId},{password:false})
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

Agrega producto al carrito

*/
export const agregarProductoCarrito = async (req,res)=>{
    try {            const{productoId, usuarioId} = req.body


        let usuarioEncontrado = await Usuario.findById(usuarioId,{password:false})
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


export const obtenerProductoCarrito = async (req,res) =>{

    try {
        
        const usuarioId = req.params.usuarioId
        const usuario = await Usuario.aggregate([
            {$match: {_id: mongoose.Types.ObjectId(usuarioId)},},
            {$project: {carrito:1,_id:0}},
                                ])

        const totalPrecio = await Usuario.aggregate([
            {$match: {_id: mongoose.Types.ObjectId(usuarioId)},},
            {$project: {carrito:1,_id:0}},
            {$unwind: { "path": "$carrito", "includeArrayIndex": "index" } },
            {$group: {"_id": {"group": "$group","index": "$index"},"carrito": { "$sum": "$carrito.precio" }}},
            {$group: {"_id": "Precio","carrito": { "$push": "$carrito" },Total:{$sum:"$carrito"}}}
        ])
            
        if(!usuario) return res.status(400).json({message:"No encontramos el usuario buscado"})
        if(usuario.deshabilitado === true) return res.status(400).json({message:"Usuario Deshabilitado"})

        res.status(200).json({
            message: "Se ha obtenido el usuario de forma correcta",
            usuario,
            totalPrecio
        })


    } catch (error) {
        res.status(500).json({
            message: "Ocurrio un error en el servidor",
            error,
         })
         console.log(`Ocurrio un error en el servidor: ${error})`)

    }

}





/////////////////////////////////////////////

export const savePedido = async (req,res) => {
    try {

        const{cantidadProductos,productosId, usuarioId} = req.body

        let usuarioEncontrado = await Usuario.findById(usuarioId,{password:false})
        if(!usuarioEncontrado) return res.status(400).json({message:"No encontramos el usuario solicitado"})
        if(usuarioEncontrado.deshabilitado === true) return res.status(400).json({message:"Usuario Deshabilitado"})

        /////////////////////
        ///PRIMERO AGREGAMOS UN PEDIDO
        ///DESPUES OBTENEMOS EL ID DE ORDEN DE ESE PEDIDO Y UTILIZAMOS
        /// ESE ID DE ORDEN PARA AGREGAR LOS DEMAS SI ES QUE HAY EN 
        /// EL ARREGLO C:
        ///////////////////////
        const productoAgregado = await Usuario.findByIdAndUpdate(usuarioId, {'$addToSet':{
            'historialPedidos':{
                'status':"orden",
                'orden':{
                    'nombre':productoEncontrado.nombre,
                        'descripcion':productoEncontrado.descripcion,
                        'categoria':productoEncontrado.categoria,
                        'precio':productoEncontrado.precio,
                        'imagenUrl':productoEncontrado.imagenUrl,
                    }
                }
            }
        },
        {
            new:true
        })






        for (let i = 1; i < cantidadProductos; i++)  {
            
            let productoEncontrado = await Producto.findById(productosId[i])
            if(!productoEncontrado) return res.status(400).json({message:"No encontramos el producto solicitado"})
            
            console.log(productoEncontrado)
            
            




            const productoAgregado = await Usuario.findByIdAndUpdate(usuarioId, {'$addToSet':{
                'historialPedidos':{
                    'status':"orden",
                    'orden':{
                        'nombre':productoEncontrado.nombre,
                            'descripcion':productoEncontrado.descripcion,
                            'categoria':productoEncontrado.categoria,
                            'precio':productoEncontrado.precio,
                            'imagenUrl':productoEncontrado.imagenUrl,
                        }
                    }
                }
            },
            {
                new:true
            })

        console.log(`Productos añadidos a la orden: ${i+1}`)

        } 

        console.log(productosId)
        console.log(usuarioId)




/*       
        


 */



                    //Se cambio el $addToSet ya que este solo agrega si no existe
/*                     const productoAgregado = await Usuario.findByIdAndUpdate(usuarioId, {'$addToSet':{
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
                }).populate('carrito') */

    res.status(200).json({
        message: `Se agrego de forma exitosa la orden`,
    })












        

    } catch (error) {
        res.status(500).json({
            message: "Ocurrio un error en el servidor",
            error,
        })
        console.log(`Ocurrio un error en el servidor: ${error})`)

    }
}



export const statusPedido = (request,response) => {

    try {











    } catch (error) {
    res.status(500).json({
        message: "Ocurrio un error en el servidor",
        error,
     })
     console.log(`Ocurrio un error en el servidor: ${error})`)

    }
}
