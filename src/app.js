const express = require('express');
const app = express(); // creating express js application 
const ConnectDB  = require("./config/database");// connecting to the database
const User = require("./models/user"); // importing the user model


//app.use(); -> this will run for every request that comes to the server
app.use(express.json()); // middleware to parse json data from the request body


// getting the data from the database and sending it to the client .
app.get("/get",async(req,res)=>{
    try{
        const users = await User.find({emailid: req.body.emailid}); // find the user by emailid
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


// adding the data to the database . 
app.post("/signup",async(req,res)=>{
    // creating instance of the user model .
    const user = new User(req.body);

    // saving the user to the database
    await user.save().then(()=>{
        console.log("User created successfully");
    }).catch((err)=>{
        console.error("Error creating user: ", err);
        return res.status(500).send("Error creating user");
    });

    // sending response to the client
    res.send("User created successfully");
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

