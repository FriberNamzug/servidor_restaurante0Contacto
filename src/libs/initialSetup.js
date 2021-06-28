import Roles from "../models/roles.model";

//Aqui se crean los roles por defecto
export const creandoRoles = async () =>{
    //con estimatedDocumentCount valida si ya existen documentos
const count = await Roles.estimatedDocumentCount()


try {
    if(count > 0) return

    const valores = await Promise.all([
         new Roles({nombre: 'administrador'}).save(),
         new Roles({nombre: 'mesero'}).save(),
         new Roles({nombre: 'cliente'}).save()
     ])
 
     console.log(valores)
} catch (error) {
    console.error(error)
}

}

export const creandoUsuario = async()=>{
    //Aqui se creara un usuario por defecto//
}