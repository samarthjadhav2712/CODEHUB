const express = require('express');
const {userAuth} = require('../middlewares/auth');

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth ,async(req,res)=>{
    const {firstName} = req.user;
    console.log("Connection request sent");
    res.send("Connection request sent successfully by "+firstName);
});

module.exports = requestRouter;