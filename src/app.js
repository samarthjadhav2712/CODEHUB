const express = require('express');

const app = express(); // creating express js application 

app.use('/',(req , res)=>{
    res.send("Hello dashboard");
})

app.use('/getdata',(req , res)=>{
    res.send("data received");
})

app.listen(3000 , ()=>{
    console.log("server is running on port 3000");  
});

