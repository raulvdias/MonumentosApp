const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/monumentoapp").then(()=>{
    console.log("Conectado com sucesso!");
}).catch((err)=>{
    console.log("Erro ao conectar!, " + err);
});

module.exports = mongoose;