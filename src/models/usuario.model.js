import {Schema, model} from 'mongoose'
import bcrypt from 'bcryptjs'

const usuarioSchema = new Schema ({
    nombre:{
        type: String,
        required:["Es nombre es requerido",true],
    },
    apellido:{
        type: String,
    },
    edad:{
        type: String,
    },
    telefono:{
        type: String,
    },
    email:{
        type:String,
        unique: true,
        required:["Es requerido ingresar el email",true],
    },
    password:{
        type:String,
        required:["La contraseña es requerida",true],
    },
    rol:{
        type:String,
        required:["El rol es requerido, pero por default es cliente",true],
        default: "cliente"
    },
    terminosCondiciones:{
        type:Boolean,
        required:["Aceptar los terminos y condiciones es necesario",true],
    },
    recibirPromociones:{
        type:Boolean,
        required:false,
        default: false
    },
    imgPerfil:{
        type:String,
        required:false,
        default: "upload/imgPerfil/perfilPerdeterminado.png"
    },
    statusLaboral:{
        type:String,
        required:true,
        default: "sin estatus"
    },
    deshabilitado:{
        type:Boolean,
        required:true,
        default: false
    },

    historialPedidos:[{
        status:{
            type: String
        },
        orden:[{
                    nombre: {
                        type: String,
                    },
                    descripcion:{
                        type: String,
                    },
                    categoria: {
                        type: String,
                    },
                    precio: {
                        type: Number,
                    },
                    imagenUrl: {
                        type: String,
                    },

                },]

    }],

    carrito:[{
        nombre: {
            type: String,
        },
        descripcion:{
            type: String,
        },
        categoria: {
            type: String,
        },
        precio: {
            type: Number,
        },
        imagenUrl: {
            type: String,
        },
    }],

    chat:[{
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario'
            },

        mensaje: String,
        mensajeType: Boolean,

        create_at: {
            type:Date,
            default: Date.now
        }
    }]

},{
    timestamps: true,
    versionKey: false
})

/* esto sirve para cifrar la contraseña */

/* Esto va a encriptar la contraseña */
usuarioSchema.statics.encryptPassword = async (password) =>{
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

/* Esto va a validar si la contraseña es correcta con el metodo compare  */
usuarioSchema.statics.compararPassword = async (password, passwordRecibido)=>{
    return await bcrypt.compare(password, passwordRecibido)
}

export default model('Usuario',usuarioSchema)