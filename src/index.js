const express = require("express");
const router = require("./routes/routes");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const mongoose = require("mongoose");
const bycript = require("bcrypt");
const acciones = require("./routes/fun")
const app = express();

// Settings
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// middlewer
app.use(morgan("dev"));
// Permite acceder a datos tipo objeto
app.use(express.json());
app.use(express.urlencoded({extended: false}));

mongoose.connect(acciones.dbLink)

// Iniciamos una sesion
app.use(session({
    secret : "Mysecret",
    saveUninitialized: false,
    resave: false

}))


app.use(router);

app.listen(app.get("port"), () => {
    console.log(`Sitio corriendo en http://localhost:${app.get("port")}`)
})