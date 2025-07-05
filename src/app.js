const express = require('express');
const app = express(); // creating express js application 
const ConnectDB  = require("./config/database");// connecting to the database
const User = require("./models/user"); // importing the user model
const {validateUserData} = require('./utils/validation'); // importing the validation function
const {validateLoginData} = require('./utils/loginValidation'); // importing the login validation function
const bcrypt = require('bcrypt'); // importing bcrypt for password hashing

//app.use(); -> this will run for every request that comes to the server
app.use(express.json()); // middleware to parse json data from the request body


// getting the data from the database and sending it to the client .
app.get("/get",async(req,res)=>{
    try{
        const users = await User.findById(req.body._id); // find the user by emailid
        if(users.length===0){
            return res.status(404).send("User not found");
        }
        else{
            res.send(users);
        }
    }
    catch(err){
        return res.status(400).send("Error fetching user data");
    }
});


// Feed API to get all users from the database.
app.get("/feed",async(req,res)=>{ 
    try{
        const users = await User.find({});
        if(users.length ===0){
            return res.status(404).send("No users found");
        }
        else{
            res.send(users);
        }
    }
    catch(err){
        return res.status(400).send("Error fetching users");
    }
});


// deleting the user from the database by id .
app.delete("/delete",async(req,res)=>{
    const userid = req.body.id; // getting the user id from the request body
    try{
        const user = await User.findByIdAndDelete(userid);
        if(!user){
            return res.status(404).send("User not found");
        }
        else{
            res.send("User deleted successfully");
        }
    }  
    catch(err){
        return res.status(400).send("Error deleting user");
    }
});


// adding the data to the database . 
app.post("/signup",async(req,res)=>{
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
app.post("/login",async(req,res)=>{
    try{
        validateLoginData(req);

        const {emailid , password} = req.body;

        // find the user or check if the emailid exists in the database
        const user = await User.findOne({emailid : emailid});
        if(!user){
            throw new Error("Invalid credentials");
        }
        // compare the password with the hashed password in the database
        const isMatch = await bcrypt.compare(password , user.password);

        if(!isMatch){
            throw new Error("Invalid credentials");
        }
        
        res.send("Login successful");
    }
    catch(err){
        res.status(400).send("Error logging in: " + err.message);
    }
});

// updating the user data in the database by id .
app.patch("/update/:userid",async(req,res)=>{
    //const user = req.body;  ...getting the user data 
    // const userid = req.body._id;   ...getting the user id 

    //destructuring so that we cant update the id field
    //const {_id : userid , ...user} = req.body; getting the user id and rest of the user data

    const userid = req.params.userid; // getting the user id from the request params
    const user = req.body;
    try{
    //only allow updates for fields that wont create issues with db . (such as emailid and password)
    const allowedUpdates = ["firstName" , "lastName" , "photourl" , "Gender","skills"];
    const validupdates = Object.keys(user).every((update) => allowedUpdates.includes(update));

    if(!validupdates){
        throw new error("Invalid updates");
    }

    if(user.skills.length > 5){
       throw new error("Skills array cannot have more than 5 elements");
    }

        const updatedUser = await User.findByIdAndUpdate(userid , user, {new: true , runValidators : true});
         // updating the user by id . 
         // new : true will return the updated user object
        // runValidators : true will ensure that the validators defined in the schema are run when updating the user.
        if(!updatedUser){
            return res.status(404).send("User not found");
        }
        else{
            res.send(updatedUser);
            console.log(updatedUser);
        }
    }
    catch(err){
        return res.status(400).send("Error updating user");
    }
});


// we should connect to the database before starting the server .
ConnectDB()
.then(()=>{
    console.log("Database connected successfully");
    app.listen(3000 , ()=>{
    console.log("server is running on port 3000");  // connection to the server
    });
}).catch((err)=>{
    console.error("Database connection failed");
});