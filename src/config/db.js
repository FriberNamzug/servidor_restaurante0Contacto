import mongoose from "mongoose";

 const uri = "mongodb+srv://friber:12344321@cluster0.0z0xh.mongodb.net/restaurante0Contacto"

mongoose.connect(uri, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify: true,
    useCreateIndex: true,
    useFindAndModify: false
    
})
    .then(db => console.log('Se ha conectado a la db'))
    .catch(error => console.log('No se ha conectado' + error))