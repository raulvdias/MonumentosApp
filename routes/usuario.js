const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Usuario');
const Usuario = mongoose.model('usuarios');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const eAdmin = require('../helpers/eAdmin');

router.get('/registro', (req, res)=>{
    res.render('./usuarios/registro');
})

router.post('/registro', (req, res)=>{
    
    const erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido!"})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "E-mail inválido!"})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha inválido!"})
    }
    if(req.body.senha.length < 5){
        erros.push({texto: "Tamanho da senha menor que 5 caracteres!"})
    }

    if(req.body.senha != req.body.senha2){
        erros.push({texto: "Senhas não são iguais!!"})
    }


    if(erros.length > 0){
        res.render('./usuarios/registro', {erros: erros});

    
    }else{
        Usuario.findOne({email: req.body.email}).lean().then((usuario)=>{
            if(usuario){
                req.flash('error_msg', 'E-mail já cadastrado!!');
                res.redirect('./registro')
            }else{
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    senha: req.body.senha,
                    email: req.body.email,
                })
        
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(novoUsuario.senha, salt, (err, hash)=>{
                        if(err){
                            req.flash('error_msg', 'Erro durante o cadastro do usuário');
                            res.redirect('/');
                        }else{
                            novoUsuario.senha = hash;
                            novoUsuario.save().then(()=>{
                                req.flash('success_msg', 'Usuário criado com sucesso!!');
                                res.redirect('/');
                            }).catch((error)=>{
                                req.flash('error_msg', 'Erro durante a criação do usuário!!');
                                res.redirect('/');
                            })
        
                        }
                    })
                })
            }
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno!!');
            res.redirect('/');
        })
    
    }

});

router.get('/login', (req, res)=>{
    res.render('./usuarios/login');
})


router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/usuarios/login',
        failureFlash: true
    })(req, res, next)
})


router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success_msg', 'Deslogado com sucesso!');
    res.redirect('/')
})
module.exports = router;