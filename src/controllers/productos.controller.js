import Producto from '../models/producto.model'

//////////////////////////////////////////////////////
    //CREANDO UN PRODUCTO
//////////////////////////////////////////////////////
export const crearProducto = async (req,res)=>{

const{nombre, categoria, precio, imagenUrl} = req.body

const nuevoProducto = new Producto({nombre, categoria, precio, imagenUrl})

const productoGuardado =  await nuevoProducto.save()

res.status(201).json(productoGuardado)

}

//////////////////////////////////////////////////////
    //OBTENER UN SOLO PRODUCTO
//////////////////////////////////////////////////////
export const obtenerProducto = async (req,res)=>{
    
    const producto = await Producto.findById(req.params.productoId)
    
    res.status(200).json(producto)

}
//////////////////////////////////////////////////////
    //OBTENER TODOS LOS PRODUCTOS
//////////////////////////////////////////////////////
export const obtenerProductos = async (req,res)=>{

    const productos = await Producto.find()
    
    res.json(productos)

}

//////////////////////////////////////////////////////
    //ACTUALIZAR UN PRODUCTO
//////////////////////////////////////////////////////
export const actualizarProducto = async (req,res)=>{
   const productoActualizado = await Producto.findByIdAndUpdate(req.params.productoId, req.body, {
       new:true
   })
   res.status(204).json(productoActualizado)

}
//////////////////////////////////////////////////////
    //ELIMINAR PRODUCTOS
//////////////////////////////////////////////////////
export const eliminarProducto = async (req,res)=>{

    const { productoId } = req.params

    await Producto.findByIdAndRemove(productoId)
    res.status(204).json()

}