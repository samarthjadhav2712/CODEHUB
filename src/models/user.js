const mongoose = require('mongoose');
const validator = require('validator'); // importing the validator library to validate the email id//
const bcrypt = require('bcrypt'); // importing bcryptjs for hashing passwords
const jwt = require('jsonwebtoken'); // importing jsonwebtoken for creating JWT tokens

//Schema creation
const userSchema = new mongoose.Schema({
    firstName :{
        type : String ,
        minlength : 2 ,
        maxlength :20, 
    },
    lastName : {
        type : String 
    },
    emailid:{
        type : String,
        required : true,
        unique : true,
        validate(value){
            if(validator.isEmail(value)==false){
                throw new Error("Email is not valid : "+value);
            }
        },
    //    immutable : true ... this will make sure that the email id cannot be changed once it is set
    },
    password:{
        type : String,
        required :true,
        minlength : 5,
    },
    age:{
        type : Number
    },
    photourl :{
        type : String , 
        default : "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-black-default-avatar-image_2237212.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Photo URL is not valid : "+value);
            }
        }
    },
    Gender : {
        type : String , 
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Gender data not valid");
            }
        },
    },
    skills :{
        type : [String], // this will allow an array of strings
        default : [] // this will set the default value to an empty array
    }
},{
    strict : true, // this will ensure that only the fields defined in the schema will be saved to the database
    timestamps : true // this will add createdAt and updatedAt fields to the schema
});

userSchema.methods.getJWT = async function(){
    // always use this normal function to access the 'this' keyword in mongoose methods.
    const user = this;

     const token = await jwt.sign({_id : user._id} ,"secretkey" , {expiresIn : "1h"});
     // {_id : user._id} is the payload of the JWT, which contains the user id , it needs object so we write like this .

     return token;
}

userSchema.methods.comparePassword = async function(password){
    const user  = this ;
    const isPassword = await bcrypt.compare(password , user.password);
    return isPassword;
}

//Model creation
const User = mongoose.model("User" , userSchema);

//Exporting the model
module.exports = User;