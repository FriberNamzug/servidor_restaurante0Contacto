import {Schema, model} from 'mongoose'
import bcrypt from 'bcryptjs'

const usuarioSchema = new Schema ({
username:{
    type: String,
    unique: true
},
email:{
    type:String,
    unique: true
},
password:{
    type:String,
    required:true
},
roles: [{
    ref:"Roles",
    type: Schema.Types.ObjectId
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