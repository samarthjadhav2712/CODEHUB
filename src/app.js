const express = require('express');
const app = express(); // creating express js application 
const ConnectDB  = require("./config/database");// connecting to the database
const User = require("./models/user"); // importing the user model

// adding the data to the database . 
app.post("/signup",async(req,res)=>{
    const DummyUser = {
        firstName : "Shruti",
        lastName : "Jadhav",
        emailid : "shrutijadhav@gmail.com",
        password :"shruti123",
        age : 46
    }
    // creating instance of the user model .
    const user = new User(DummyUser);

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

