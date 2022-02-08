const mongoose = require('mongoose')

//definição de model
const Usuario = mongoose.Schema({
    nome:{
        type: String,
        required: true
    },
    senha:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    eAdmin:{
        type: Number,
        default: 0
    }
})

//nome da collection
mongoose.model('usuarios', Usuario);
