//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/usarioDB");

const esquemaUsuario = {
    email: String,
    password: String
}

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
    const novoUsuario = new Usuario({
        email: req.body.nomeusuario,
        password: req.body.password
    });

    novoUsuario.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.render("segredo");
        }
    });
})

app.listen(3000, function (req, res) {
    console.log("Servidor inicou na porta 3000!");
});