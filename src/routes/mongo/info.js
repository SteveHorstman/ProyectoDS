const mongoose = require("mongoose");

let informacionSchema = new mongoose.Schema({
    _id : {type:String, required : true},
    names : {type: String, required : true},
    lastnames : {type: String, required : true},
    birthdate : {type: String, required : true},
    sex : {type: String, required : true},
    email : {type: String, required : true},
    celphone : {type: String, required : true},
    username : {type: String, required : true},
    password : {type: String, required : true},
    enfermedades : {type: Array, required : true}
});

module.exports = mongoose.model("prueba2", informacionSchema)