const express = require('express');
const app = express(); // creating express js application 
const {auth} = require('./middlewares/auth'); // importing auth middleware

// one way to handle errors is to use try-catch blocks in route handlers .
app.get('/admin',(req , res)=>{
    try{
    console.log("Admin route accessed");
    throw new Error("Simulated error for testing error handling");
    res.send("Welcome to the admin page");
    }
    catch(err){
        console.error("Error in admin route:", err);
        res.status(500).send("Internal Server Error");
    }
});

// another way to handle errors is to use middleware functions that catch errors and send a response.
app.get('/admin',(req,res,next)=>{
    console.log("Admin route accessed");
    // Simulating an error
    const error = new Error("Simulated error for testing error handling");
    next(error); // Pass the error to the next middleware
});

app.use((err,req,res,next)=>{
        // This middleware will catch any errors passed to next(err) in the route handlers.
        console.error("An error occurred:", err);
        res.status(500).send("Internal Server Error");
});


app.listen(3000 , ()=>{
    console.log("server is running on port 3000");  
});

