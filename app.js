//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session  = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20");
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: "Nosso pequeno segredo.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/usarioDB");

const esquemaUsuario = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String
});

esquemaUsuario.plugin(passportLocalMongoose);
esquemaUsuario.plugin(findOrCreate);

const Usuario = new mongoose.model("Usuario", esquemaUsuario);

passport.use(Usuario.createStrategy());
passport.use(new LocalStrategy(Usuario.authenticate()));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        username: user.username,
        picture: user.picture
      });
    });
});
  
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/segredo",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    Usuario.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/auth/google", passport.authenticate('google', 
    { scope: ['profile'] }
    )
);

app.get("/auth/google/segredo", 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    
    res.redirect('/segredo');
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/registro", function (req, res) {
    res.render("registro");
});

app.get("/segredo", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("segredo");
    } else {
        res.redirect("/login");
    }
});

app.get("/logout", function (req, res) {
    req.logout(function (err) {
        if (err) {
            console.log(err);
        }
        res.redirect("/");
    })
});

app.post("/registro", function(req,res){

    Usuario.register({username: req.body.username}, req.body.password,function(err, usuario){
  
      if(err){  
        console.log("Erro no registro.", err);
        res.redirect("/registro");
      }else{
        passport.authenticate("local")(req, res, function(){
        console.log(usuario, 101);
          res.redirect("/segredo");
      });
  }});
  
});

app.post("/login", function (req, res) {
    
    const usuario = new Usuario({
        username: req.body.username,
        password: req.body.password
    });

    req.login(usuario, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/segredo");
            })
        }
    })

});

app.listen(3000, function (req, res) {
    console.log("Servidor inicou na porta 3000!");
});