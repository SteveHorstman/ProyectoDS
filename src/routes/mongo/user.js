const mongoose = require("mongoose");

let usuarioSchema = mongoose.Schema({
    _id : {type:String, required : true}  ,
    username : {type:String, required : true},
    email : {type:String, required : true},
    password : {type:String, required : true},
    enfermedadesRegistradas : {type : Boolean, required :  true}
})

module.exports = mongoose.model("prueba1", usuarioSchema);