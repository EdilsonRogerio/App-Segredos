//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/usarioDB");

const esquemaUsuario = new mongoose.Schema({
    email: String,
    password: String
});

const Usuario = new mongoose.model("Usuario", esquemaUsuario);

app.get("/", function (req, res) {
    res.render("home");
});
app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/registro", function (req, res) {
    res.render("registro");
});

app.post("/registro", function (req, res) {
    
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const novoUsuario = new Usuario({
            email: req.body.nomeUsuario,
            password: hash
        });
    
        novoUsuario.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.render("segredo");
            }
        });
    });
    
    
});

app.post("/login", function (req, res) {
    const nomeusuario = req.body.nomeUsuario;
    const password = req.body.password;

    Usuario.findOne({email: nomeusuario}, function (err, usuarioEncontrado) {
        if (err) {
            console.log(err);
        } else {
            if (usuarioEncontrado) {
                bcrypt.compare(password, usuarioEncontrado.password, function (err, result) {
                    if (result === true) {
                        res.render("segredo")
                    }
                });
            }
        }
    });

});

app.listen(3000, function (req, res) {
    console.log("Servidor inicou na porta 3000!");
});