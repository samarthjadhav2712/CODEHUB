const express = require('express');
const app = express(); // creating express js application 
const {auth} = require('./middlewares/auth'); // importing auth middleware

app.use('/Admin',auth);

app.get('/Admin/getUserData' ,(req,res,auth)=>{
    res.send("User data fetched successfully");
});

app.post('/Admin/DeleteUserData' ,(req,res,auth)=>{
    res.send("User data deleted successfully");
});

app.listen(3000 , ()=>{
    console.log("server is running on port 3000");  
});

