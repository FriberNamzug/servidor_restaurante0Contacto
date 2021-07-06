import Producto from '../models/producto.model'

//////////////////////////////////////////////////////
    //CREANDO UN PRODUCTO
//////////////////////////////////////////////////////
export const crearProducto = async (req,res)=>{

try {
    
const{nombre, descripcion, categoria, ingredientes, precio, imagenUrl} = req.body

const nuevoProducto = new Producto({
    nombre,
    descripcion,
    categoria,
    ingredientes,
    precio,
    imagenUrl
})

const productoGuardado =  await nuevoProducto.save()

res.status(201).json({
    message: "Producto creado con exito",
    productoGuardado
})



} catch (error) {

    res.status(500).json({
        message: "Ocurrio un error en el servidor",
        error,
     })
     console.log(`Ocurrio un error en el servidor: ${error})`)
  
}








}

//////////////////////////////////////////////////////
    //OBTENER UN SOLO PRODUCTO
//////////////////////////////////////////////////////
export const obtenerProducto = async (req,res)=>{


try {

    const producto = await Producto.findById(req.params.productoId)
    
    if(producto === null) return res.status(400).json({message:"No encontramos el producto buscado"})

    res.status(200).json({
        message: "Se ha obtenido el producto de forma correcta",
        producto
    })
    console.log(producto)


} catch (error) {
    res.status(500).json({
        message: "Ocurrio un error en el servidor",
        error,
     })
     console.log(`Ocurrio un error en el servidor: ${error})`)
  
}

}
//////////////////////////////////////////////////////
    //OBTENER TODOS LOS PRODUCTOS
//////////////////////////////////////////////////////
export const obtenerProductos = async (req,res)=>{




    try {
        const productos = await Producto.find()

        if(productos === null) return res.status(400).json({message:"No encontramos producos en la database"})

        res.json({
            message: "Se han obtenido los productos de forma correcta",
            productos
        })
        
        
    } catch (error) {
        res.status(500).json({
            message: "Ocurrio un error en el servidor",
            error,
         })
         console.log(`Ocurrio un error en el servidor: ${error})`)
    }



}

//////////////////////////////////////////////////////
    //ACTUALIZAR UN PRODUCTO
//////////////////////////////////////////////////////
export const actualizarProducto = async (req,res)=>{

    try {

        const productoId = req.params.productoId
/* 
validamos si es que se envia una id correcta
*/
        const producto = await Producto.findById(productoId)
        if(producto === null) return res.status(400).json({message:"No encontramos el producto buscado"})

        /* despues de validar, enviamos actualizacion con lo que se reciba de body */
        const productoActualizado = await Producto.findByIdAndUpdate(productoId, req.body, {
            new:true
        })

        res.status(200).json({
            message: "Se actualizo de forma exitosa el producto",
            productoActualizado
        })
        
        
    } catch (error) {
        res.status(500).json({
            message: "Ocurrio un error en el servidor",
            error,
         })
         console.log(`Ocurrio un error en el servidor: ${error})`)
    }

}
//////////////////////////////////////////////////////
    //ELIMINAR PRODUCTOS
//////////////////////////////////////////////////////
export const eliminarProducto = async (req,res)=>{

    try {

        
        const productoId = req.params.productoId

        const producto = await Producto.findById(productoId)

        if(producto === null) return res.status(400).json({message:"No encontramos el producto buscado"})
    
        await Producto.findByIdAndRemove(productoId)
        res.status(200).json({
            message: "Se elimino de forma correcta el producto",
            producto
        })
        
    } catch (error) {

        res.status(500).json({
            message: "Ocurrio un error en el servidor",
            error,
         })
         console.log(`Ocurrio un error en el servidor: ${error})`)

    }


}