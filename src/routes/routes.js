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

router.post("/register", acciones.registerPrueba)

router.post("/check", acciones.login)

router.get("/profile", (req,res) => {
    if (req.session.isLogged == true){
    // Simpre que queramos usar los datos dentro de un archivo es mejor guardar el json de los datso en una constante
    res.send("Enviado")
    } else {
        res.redirect("/login");
    }
});

router.get("/error", (req, res) => {res.send("error")})

module.exports = router;