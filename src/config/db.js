import mongoose from "mongoose";
import { uri } from "./urlDB";

/* const uri = ""; */ //agregar la uri

mongoose.connect(uri, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify: true,
    useCreateIndex: true,
    useFindAndModify: false

})
    .then(db => console.log('Se ha conectado a la db'))
    .catch(error => console.log('No se ha conectado' + error))