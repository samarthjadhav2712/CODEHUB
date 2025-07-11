const express = require('express');
const {validateUserData} = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const {validateLoginData} = require('../utils/loginValidation');

const authRouter = express.Router();

// adding the data to the database . 
authRouter.post("/signup",async(req,res)=>{
    // industry standard flow  : 1) validate 2) encrypt password 3) create user and save to database . 

    try{
    validateUserData(req); // validate the user data from the request body
    
    const {firstName , lastName , emailid , password , age ,skills } = req.body; // destructuring the user data from the request body

    const hashedPassword = await bcrypt.hash(req.body.password, 10); // hashing the password with bcrypt
    console.log("Hashed Password: ", hashedPassword);
        
    // creating instance of the user model .
    const user = new User(
        {
            firstName ,
            lastName ,
            emailid ,
            password : hashedPassword, // saving the hashed password to the database
            age ,
            photourl : req.body.photourl || "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-black-default-avatar-image_2237212.jpg", // setting default photo url if not provided
        }
    );
    // saving the user to the database
    await user.save();

    res.send("User created successfully");
    }
    catch(err){
        if(err.code === 11000) {
            // 11000 is the error code for duplicate key error
            return res.status(400).send("Email already exists");
        }

        if(err.name === 'ValidationError') {
            // this will be only called if mongoose schema validation fails .
            // Handle validation errors
            return res.status(400).send(err.message);
        }

         res.status(500).send("Error creating user : "+err.message);
    }
});

// login API to authenticate the user
authRouter.post("/login",async(req,res)=>{
    try{
        validateLoginData(req);

        const {emailid , password} = req.body;

        // find the user or check if the emailid exists in the database
        const user = await User.findOne({emailid : emailid});
        if(!user){
            throw new Error("Invalid user");
        }

        // compare the password with the hashed password in the database
        const isPassword = await user.comparePassword(password);

        if(isPassword){
            // create  a JWT token . 
            const token = await user.getJWT(); 
            // signing the token with a secret key and setting an expiration time of 1 hour

            // Add the Token to cookie & send the response back to the user . 
            res.cookie("jwt_token", token ); // can even expire the cookie .

            res.send("Login successful");
        }
        else{
            throw new Error("Invalid password");
        }
    }
    catch(err){
        res.status(400).send("Error logging in: " + err.message);
    }
});

module.exports = authRouter;