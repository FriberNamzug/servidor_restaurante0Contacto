import Roles from "../models/roles.model";
import Usuario from "../models/usuario.model"

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


    try {

        /* validamops que no haya usuarios registrados, ya que seran los de testeo */
        const count = await Usuario.estimatedDocumentCount()
        if(count > 0) return        //aqui se detiene si existen documentos en la coleccion de usuarios

        const valores = await Promise.all([

            /* USUARIO ADMINISTRADOR */
            new Usuario({
                nombre: 'administrador',
                apellido: 'admin',
                edad: 99,
                telefono: "4499999999",
                terminosCondiciones: true,
                email: "admin@admin.com",
                password: await Usuario.encryptPassword('admin'),
                rol: 'administrador'
            }).save(),

            /* USUARIO EMPLEADO */
            new Usuario({
                nombre: 'empleado',
                apellido: 'empleado',
                edad: 99,
                telefono: "4499999999",
                terminosCondiciones: true,
                email: "empleado@empleado.com",
                password: await Usuario.encryptPassword('empleado'),
                rol: 'empleado'
            }).save(),

            /* USUARIO CLIENTE */
            new Usuario({
                nombre: 'cliente',
                apellido: 'cliente',
                edad: 99,
                telefono: "4499999999",
                terminosCondiciones: true,
                email: "cliente@cliente.com",
                password: await Usuario.encryptPassword('cliente'),
                rol: 'cliente'
            }).save(),
        ])    

         console.log(valores)


} catch (error) {

 console.log(`Ocurrio un error en el servidor: ${error})`)
    
}











}