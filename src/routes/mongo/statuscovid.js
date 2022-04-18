const mongoose = require("mongoose");

let statusSchema = new mongoose.Schema({
    _id : {type : String, required : true},
    fecha : {type: String, required : true},
    hora : {type : Number , required : true},
    infectado : {type : String, required : true}
})

module.exports = mongoose.model("status", statusSchema);