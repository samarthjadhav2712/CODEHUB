const express = require('express');

const app = express(); // creating express js application 

app.get("/user/:userid",(req , res)=>{
    console.log(req.query); // dynamic data from url. 
    // dynamic routes 
    console.log(req.params); 
    res.send({"firstname" : "Samarth","Lastname" : "Jadhav"});
});

app.post("/user",(req , res)=>{
    //saving data to db
    res.send("Data successfully saved in db");
});

// app.use('/',(req , res)=>{
//     res.send("Hello dashboard");
// })

app.listen(3000 , ()=>{
    console.log("server is running on port 3000");  
});

