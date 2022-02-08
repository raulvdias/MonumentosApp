//módulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const path = require("path");
const admin = require('./routes/admin');
const usuarios = require('./routes/usuario');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const { allowedNodeEnvironmentFlags } = require('process');
require('./models/Monumento')
require('./models/Categoria')
const Monumento = mongoose.model('monumentos');
const Categoria = mongoose.model('categorias');
const passport = require('passport');
require('./config/auth')(passport);
const db = require('./config/db');


mongoose.connect(db.mongoURI).then(()=>{
    console.log("Conectado ao banco com sucesso!");
}).catch((err)=>{
    console.log("Erro ao conectar com o banco! " + err);
})

//configuração
    //sessão
    app.use(session({
        secret:"nodeJSteste",
        resave: true,
        saveUninitialized: true
    }))
    app.use(passport.initialize());
    app.use(passport.session())
    app.use(flash());
    //middleware
    app.use((req, res, next)=>{
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");
        res.locals.error = req.flash('error');
        res.locals.user = req.user || null;
        next();
    })
    //bodyparser
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json())
    //handlebars
    app.engine('handlebars', handlebars.engine())
    app.set('handlebars', handlebars.engine({   
    defaultLayout:'main'
    }))
    app.set('view engine','handlebars');
    //public (estático)
    app.use(express.static(path.join(__dirname, 'public')))


//rotas
app.get('/', (req, res)=>{
    Monumento.find().lean().populate('categoria').sort({data:'DESC'}).then((monumentos)=>{
        res.render('index', {monumentos: monumentos});
    }).catch((error)=>{
        req.flash('error_msg', 'Houve um erro interno');
        res.redirect('/404')
    })
})

app.get('/monumentos/:nomeobra', (req, res)=>{
    Monumento.findOne({nomeobra: req.params.nomeobra}).lean().then((monumento) =>{
        if(monumento){
            res.render('./monumento/index', {monumento: monumento});
        }else{
            req.flash('error_msg', 'Monumento não encontrado!!');
            res.redirect('/');
        }
    }).catch((err)=>{
        req.flash('error_msg', 'Erro interno!!');
        res.redirect('/');
    })
})

app.get("/categorias", (req, res)=>{
    Categoria.find().lean().sort({date: 'DESC'}).then((categoria)=>{
        res.render('./categoria/index', {categoria: categoria})
    }).catch((err)=>{
        req.flash('error_msg', 'Erro ao encontrar categorias');
        res.redirect('/');
    })
})

app.get('/categorias/:nome', (req, res)=>{
    Categoria.findOne({nome: req.params.nome}).lean().then((categoria)=>{
        if(categoria){
            Monumento.find({categoria: categoria._id}).lean().then((monumentos)=>{
                res.render('./categoria/monumentos', {categoria: categoria, monumentos: monumentos});
            }).catch((err)=>{
                req.flash('error_msg', 'Erro ao listar as categorias!!')
                req.redirect('/');
            })
        }else{
        req.flash('error_msg', 'Esta categoria não existe!!');
        res.redirect('/');
        }
}).catch((err)=>{
    req.flash('error_msg', 'Erro interno!!');
    res.redirect('/');
})
});




app.get('/404', (req, res)=>{
    res.send('Erro 404!');
})
app.use('/admin', admin);
app.use('/usuarios', usuarios);


//outros
const PORT = process.env.PORT || 3000;
app.listen(process.env.PORT, ()=>{
    console.log("Servidor rodando!");
});