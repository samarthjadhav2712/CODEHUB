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
},{
    strict : true, // this will ensure that only the fields defined in the schema will be saved to the database
    timestamps : true // this will add createdAt and updatedAt fields to the schema
});

//Model creation
const User = mongoose.model("User" , userSchema);

//Exporting the model
module.exports = User;