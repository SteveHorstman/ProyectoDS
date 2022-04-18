const mongoose = require("mongoose");
const Usuario = require("./mongo/user");
const Info = require("./mongo/info");
const Status = require("./mongo/statuscovid");

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
            res.redirect("/profile");
        }
    }else{
        res.redirect("/login")}
}

acciones.regsitrarEnfermedades = async function(req,res) {
    const enfermedades = ["hipertension", "diabetes", "hepatitis", "probelmasRespiratorios", "cirigias", "fiebreReumantica", "accidentes/traumas", "sistemaNervioso", "alergias", "vih", "embarazo", "mareos/nuaseas", "cardiovasculares", "ets", "tratamientoMedico", "asma", "epilepsia"];
    const enfermedadesPadecidas = [];
    for (i = 0; i < enfermedades.length - 1; i++){
        if (req.body[enfermedades[i]] != undefined){
            enfermedadesPadecidas.push(enfermedades[i])
        }
    }

    await Info.findByIdAndUpdate({_id : req.session.email}, {enfermedades : enfermedadesPadecidas});
    
    await Usuario.findByIdAndUpdate({_id : req.session.email},{enfermedadesRegistradas : true});
    
    // TODO. Borrar el console.log()
    console.log(enfermedadesPadecidas);

    res.rendirect("/profile");
}

acciones.status = async function(req,res) {
    if (req.session.isLogged == true){
        let date = new Date();
        const resultado = await Status.findOne({_id : req.session.email})
        const fecha = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        if (resultado != null){
            if (resultado.fecha !== fecha || (date.getHours()*360 + date.getMinutes()*60 + date.getSeconds()) - resultado.hora > 10800){  
            res.render("statuscovid");
        }else{
            res.redirect("/state");
        }
        }else{
            res.render("statuscovid");
        }
    }else{
        res.redirect("/login");
    }
}

acciones.entrada = async function(req,res) {
    const preguntas = ["pregunta1", "pregunta2", "pregunta3", "pregunta4", "pregunta5"];
    let numero = 0;
    let date = new Date();
    const dia = date.getDate();
    const mes = date.getMonth() + 1;
    const año = date.getFullYear();
    if (req.session.isLogged == true){
        console.log("Prueba")
        const resultado = await Status.findOne({_id : req.session.email.toString()});
        //! console.log(resultado);
        console.log(req.session.email);
        console.log(resultado);
        if (resultado == null){
            console.log("1")
            if (req.body[preguntas[0]] != undefined && req.body[preguntas[1]] != undefined && req.body[preguntas[2]] != undefined && req.body[preguntas[3]] != undefined && req.body[preguntas[4]] != undefined){
                for(i= 0; i< preguntas.length; i++){
                    if(req.body[preguntas[i]] == "Si"){
                        numero += 1;
                    }
                 }
                let salud;
                if (numero >= 4){
                    salud = "Peligro de infección"
                }else if (numero <  4 && numero >= 2){
                    salud = "Posible covid"
                }else if (numero == 1){
                    salud = "Baja probabilidad de que este infectado"
                }else{ 
                    salud = "No infectado"
                }

                let statusregistro = new Status({
                    _id : req.session.email,
                    fecha : `${dia}/${mes}/${año}`,
                    hora : date.getHours()*360 + date.getMinutes()*60 + date.getSeconds(), 
                    infectado : salud
                })

                await statusregistro.save((err, document) => {if (err) {throw err}});
                res.redirect("/state");
            }else{
                console.log("\n Error no se seleciono todas \n")
                res.redirect("/statuscovid");
            }
        }else{
            console.log("Ya hay una")
            if (req.body[preguntas[0]] != undefined && req.body[preguntas[1]] != undefined && req.body[preguntas[2]] != undefined && req.body[preguntas[3]] != undefined && req.body[preguntas[4]] != undefined){
                for(i= 0; i< preguntas.length; i++){
                    if(req.body[preguntas[i]] == "Si"){
                        numero += 1;
                    }
                 }
                let salud;
                if (numero >= 4){
                    salud = "Peligro de infección"
                }else if (numero <  4 && numero >= 2){
                    salud = "Posible covid"
                }else if (numero == 1){
                    salud = "Baja probabilidad de que este infectado"
                }else{ 
                    salud = "No infectado"
                }

                await Status.findOneAndUpdate({_id: req.session.email}, {fecha : `${dia}/${mes}/${año}`, hora : date.getHours()*360 + date.getMinutes()*60 + date.getSeconds(), infectado : salud})

                res.redirect("/state");

            }else{
                console.log("\n Error no se seleciono todas \n")
                res.redirect("/statuscovid");
            }
        }
    }else{
        res.redirect("/login")
    }
}

module.exports = acciones;