import {Schema, model } from 'mongoose'

const productoSchema = new Schema ({
    nombre: {
        type: String,
        require: ["Se requiere nombre del producto", true]
    },
    descripcion:{
        type: String,
        require:  ["Se requiere descripcion del producto", true]
    },
    ingredientes: {
        type: String,
    },
    categoria: {
        type: String,
        require:  ["Se requiere categoria del producto", true]
    },
    precio: {
        type: Number,
        require:  ["Se requiere precio del producto", true]
    },
    imagenUrl: {
        type: String,
        require:  ["Se requiere imagen del producto", true]
    }
    
},{
    timestamps: true,
    versionKey: false
})

export default model('Producto',productoSchema)