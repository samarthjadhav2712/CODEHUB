const mongoose = require('mongoose');

//Schema creation
const userSchema = new mongoose.Schema({
    firstName :{
        type : String 
    },
    lastName : {
        type : String 
    },
    emailid:{
        type : String
    },
    password:{
        type : String
    },
    age:{
        type : Number
    }
});

//Model creation
const User = mongoose.model("User" , userSchema);

//Exporting the model
module.exports = User;