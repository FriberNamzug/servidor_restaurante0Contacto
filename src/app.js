import express from 'express'
import morgan from 'morgan'
import pkg from "../package.json";
import productosRoutes from './routes/productos.routes'

const app = express()


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



app.use('/productos',productosRoutes)

export default app