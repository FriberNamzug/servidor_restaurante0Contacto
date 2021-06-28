import mongoose from "mongoose";

mongoose.connect("mongodb://localhost/apiRestaurante", {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify: true,
    useCreateIndex: true

})
    .then(db => console.log('Se ha conectado a la db'))
    .catch(error => console.log('No se ha conectado' + error))