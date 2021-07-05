import app from './app'
import  './config/db'
import './config/env'

app.listen(process.env.PORT, ()=>{
    console.log(`Servidor desde el puerto ${process.env.PORT}`)
})