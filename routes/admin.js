const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
require('../models/Monumento')
const Categoria = mongoose.model('categorias');
const Monumento = mongoose.model('monumentos');
const {eAdmin} = require('../helpers/eAdmin');

router.get('/', eAdmin,(req, res) =>{
    res.render('admin/index')
})

router.get('/categorias', eAdmin, (req, res)=>{
    Categoria.find().sort({date: 'desc'}).lean().then((categorias)=>{
        res.render('admin/categorias', {categorias: categorias});
    }).catch((erros) =>{
        req.flash('error_msg', 'Erro ao tentar listar categorias do banco de dados!');
        res.redirect('/admin');
    })
})

router.get('/categorias/add', eAdmin,(req, res)=>{
    res.render('admin/addcategorias');
})


router.post('/categorias/nova', eAdmin,(req, res)=>{

    const erros = [];
    
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({text: "Nome inválido!"});
    };
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({text: "Descrição inválida!"});
    }
    if(req.body.nome.length < 4){
        erros.push({text: "Quantidade de letras insuficente!"})
    }

    if(erros.length > 0){
        res.render('admin/addcategorias', {erros: erros})
    }else{
    
        const novaCategoria = {
        nome: req.body.nome,
        descricao: req.body.descricao
    }
    new Categoria(novaCategoria).save().then(()=>{
        req.flash('success_msg', "Categoria criada com sucesso!");
        res.redirect('/admin/categorias');
    }).catch((err)=>{
        req.flash('error_msg', "Erro ao criar categoria!");
        res.redirect('/admin');
    })}
})

router.get('/categorias/edit/:id', eAdmin,(req, res)=>{
    Categoria.findOne({_id: req.params.id}).lean().then((categoria)=>{
        res.render('admin/editcategorias', {categoria: categoria})
    }).catch((error)=>{
        req.flash('error_msg', 'Categoria não encontrada!')
        res.redirect('/admin/categorias')
    })
})


router.post('/categorias/edit', eAdmin,(req, res)=>{
    Categoria.where({_id: req.body.id}).updateOne({ 
        nome: req.body.nome,
        descricao: req.body.descricao}).then(()=>{
        req.flash('success_msg', 'Categoria editada com sucesso!');
        res.redirect('/admin/categorias');
        }).catch((error)=>{
            req.flash('error_msg', 'Erro ao editar categoria!');
            res.redirect('/admin/categorias');
        })
    })

router.post('/categorias/delete', eAdmin,(req, res)=>{
    Categoria.where({_id: req.body.id}).deleteOne().then(()=>{
        req.flash('success_msg', 'Categoria deletada com sucesso!');
        res.redirect('/admin/categorias');
    }).catch((error)=>{
        req.flash('error_msg', 'Erro ao excluir categoria!');
        res.redirect('/admin/categorias');
    })
})


router.get('/monumentos', (req, res)=>{
    Monumento.find().populate("categoria").sort({date: 'DESC'}).lean().then((monumentos)=>{
        res.render('admin/monumentos', {monumentos: monumentos})
    }).catch((error)=>{
        req.flash('error_msg', 'Erro ao listar monumentos!');
        res.redirect('/admin');
    })
})

router.post('/monumentos/delete', eAdmin,(req, res)=>{
    Monumento.where({_id: req.body.id}).lean().deleteOne().then(()=>{
        req.flash('success_msg', 'Monumento deletado com sucesso!');
        res.redirect('/admin/monumentos');
    }).catch((error)=>{
        req.flash('error_msg', 'Erro ao tentar excluir monumento!');
        res.redirect('/admin/monumentos');
    })
})

router.get('/monumentos/add', eAdmin,(req, res)=>{
    Categoria.find().lean().then((categorias)=>{
        res.render('admin/addmonumentos', {categorias: categorias});
    }).catch((error)=>{
        req.flash('error_msg', 'Erro ao carregar formulário!');
        res.redirect('/admin/monumentos')
    })
})

router.get('/monumentos/edit/:id', eAdmin,(req, res)=>{
    Monumento.findOne({_id: req.params.id}).lean().then((monumento)=>{
        Categoria.find().lean().then((categorias)=>{
            res.render('admin/editmonumentos', {categorias: categorias, monumento: monumento});
        })
    }).catch((err)=>{
        req.flash('error_msg', 'Erro ao listar categorias!');
        res.redirect('/admin/monumentos');
    }).catch((err)=>{
        req.flash('error_msg', 'Erro ao carregar formulário!');
        res.redirect('/admin/monumentos')})
    })
        

router.post('/monumentos/edit', eAdmin,(req, res)=>{
    Monumento.findOne({_id: req.body.id}).then((monumento)=>{
        monumento.nomeobra = req.body.nomeobra
        monumento.idade = req.body.idade
        monumento.local = req.body.local
        monumento.descricao = req.body.descricao
        monumento.categoria = req.body.categoria

        monumento.save().then(()=>{
            req.flash('success_msg', 'Monumento editado!');
            res.redirect('/admin/monumentos')
        }).catch((error)=>{
            req.flash('error_msg', 'Erro interno!');
            res.redirect('/admin/monumentos')
        })
    }).catch((error)=>{
        req.flash('error_msg', 'Erro ao editar monumento!');
        console.log(error);
        res.redirect('/admin/monumentos');
    })
})

router.post('/monumentos/nova', eAdmin,(req, res)=>{
    const erros = [];
    if(req.body.categoria == '0'){
        erros.push({text: 'Categoria inválida, registre uma categoria!'});
    }
    if(erros.length > 0){
        res.render('admin/addmonumentos', {erros: erros});
    }else{
        const novoMonumento = {
            nomeobra: req.body.nomeobra,
            idade: req.body.idade,
            local: req.body.local,
            descricao: req.body.descricao,
            categoria: req.body.categoria
        }

        new Monumento(novoMonumento).save().then(()=>{
            req.flash('success_msg', 'Sucesso ao salvar monumento!');
            res.redirect('/admin/monumentos');
        }).catch((error)=>{
            req.flash('error_msg', 'Erro ao salvar novo monumento!');
            res.redirect('/admin/monumentos');
        })
    }
})

module.exports = router;