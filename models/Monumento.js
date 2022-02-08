const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MonumentoSchema = new Schema({
    nomeobra:{
        type: String,
        required: true
    },
    idade:{
        type: Number,
        required: true
    },
    local:{
        type: String,
        required: true
    },
    descricao:{
        type:String,
        required: true
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: 'categorias',
        required: true
    },
    data:{
        type: Date,
        default: Date.now()
    }
})

mongoose.model('monumentos', MonumentoSchema);