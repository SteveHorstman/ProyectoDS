const router = require("express").Router();
const path = require("path"); 
const acciones = require("./fun");

router.get("/", (req,res) => {
    res.redirect("/login")
})

router.get("/login", (req,res) => {
    res.render("login", {
        title : "login"
    });
});

router.get("/signup", (req,res) => {
    res.render("signup");
});

router.post("/validate", acciones.register)

router.post("/check", acciones.login)

router.get("/profile", (req,res) => {
    if (req.session.isLogged == true){
        if (req.session.enfermedadesRegistradas == "false"){
            res.redirect("/enfermedades");
        }else{
            res.send("Enviado")
        }
    } else {
        res.redirect("/login");
    }
});

router.get("/enfermedades", acciones.enfermedades)

router.get("/error", (req, res) => {res.send("error")})

module.exports = router;