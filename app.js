//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {
    res.render("home");
});
app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/registro", function (req, res) {
    res.render("registro");
});

app.listen(3000, function (req, res) {
    console.log("Servidor inicou na porta 3000!");
});