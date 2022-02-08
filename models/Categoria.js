const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoriaSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    }
})

mongoose.model('categorias', CategoriaSchema);