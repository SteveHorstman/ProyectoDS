const mongoose = require("mongoose");
const Usuario = require("./mongo/user");
const Info = require("./mongo/info");

const acciones = {};

acciones.dbLink = "mongodb://localhost:27017/proyecto";
acciones.login = (req,res) => {
    res.render("login.ejs", {
        title : "login"
    });
}

acciones.register = async function(req,res) {
    console.log(req.body);
    const names = req.body.names.toString();
    const lastnames = req.body.lastnames.toString();
    const sex = req.body.sex.toString();
    const birthdate = req.body.birthdate.toString();
    const email = req.body.email.toString();
    const celphone = req.body.celphone.toString();
    const username = req.body.username.toString();
    const password = req.body.password.toString();

    let registrarUsuario = new Info({
        _id : email,
        names : names,
        lastnames : lastnames,
        birthdate : birthdate,
        sex : sex,
        email : email,
        celphone : celphone,
        username : username,
        password: password, 
        enfermedades : []
    });

    let registerInicio = new Usuario({
        _id : email,
        username : username,
        email : email,
        password : password,
        enfermedadesRegistradas : false
    });

    //TODO Hacer una alerta si no te accepta el correo
    await registerInicio.save((err, document) => {
        if (err) {
            {res.redirect("/signup", {
                alerta : true
            })}
        }else{
            console.log(document)
        }
    });

    await registrarUsuario.save((err, document) => {
        if (err) {
            throw err;
        }else{
            req.session.username = username;
            req.session.email = email;
            req.session.isLogged = true;
            req.session.enfermedadesRegistradas = false;
            res.redirect("/enfermedades");
        }
        });
}

acciones.login = async function(req, res){
    const email = req.body.email.toString();
    const password = req.body.password.toString();
    const result = await Usuario.findOne({_id : email, password : password})
    // TODO. Borrar el console.log(), cuando se entrega el proyecto
    console.log(result);
    if (result != null){
        req.session.isLogged = true;
        req.session.username = result.username;
        req.session.email = email;
        req.session.enfermedadesRegistradas = result.enfermedadesRegistradas;
        console.log(result.enfermedadesRegistradas)
        res.redirect("/profile");
    }else{
        res.redirect("/error");
    }
}

acciones.enfermedades = async function(req,res) {
    if(req.session.isLogged == true){
        if (req.session.enfermedadesRegistradas == false){
            res.render("enfermedades");
        }else{
            res.redirect("/profile")
        }
    }else{
        res.redirect("/login")}
}

module.exports = acciones;