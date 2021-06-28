import express from 'express'
import morgan from 'morgan'
import pkg from "../package.json";

import {creandoRoles, creandoUsuario} from "./libs/initialSetup"


import productosRoutes from './routes/productos.routes'
import autenticacionRoutes from './routes/autenticacion.routes'

const app = express()

creandoRoles()
 

app.use(express.json())
app.set('pkg',pkg)
app.use(morgan('dev'))
app.get('/',(req,res) =>{
    res.json({
        autor: app.get('pkg').author,
        descripcion: app.get('pkg').description,
        version: app.get('pkg').version,
    })
})



app.use('/api/productos',productosRoutes)
app.use('/api/autenticacion',autenticacionRoutes)

export default app