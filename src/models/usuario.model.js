import {Schema, model} from 'mongoose'
import bcrypt from 'bcryptjs'

const usuarioSchema = new Schema ({
    nombre:{
        type: String,
        required:true
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
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    rol:{
        type:String,
        required:true,
        default: "cliente"
    },
    terminosCondiciones:{
        type:Boolean,
        required:true,
    },
    recibirPromociones:{
        type:Boolean,
        required:false,
        default: false
    },
    rol:{
        type:String,
        required:true,
        default: "cliente"
    }





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