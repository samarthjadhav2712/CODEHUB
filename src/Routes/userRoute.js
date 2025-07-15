const express = require('express');
const { userAuth } = require('../middlewares/auth');
const User = require("../models/user");
const { ConnectionRequest } = require('../models/connectionRequest');

const userRouter = express.Router();

userRouter.get("/user/request/received" ,userAuth, async(req,res)=>{
    /*
        loggedin user shld be able to see the interested requests he received .
    */ 
    try{
    const loggedInUser = req.user;
    const userId = loggedInUser._id;

    // get the users whose toUserid is loggedin userid & status is interested .
    const users = await ConnectionRequest.find({
        toUserID : userId,
        status : "interested"
    }).populate("fromUserId",["firstName" , "lastName" , "-_id"]);
    // populate to extract users from fromUserId . 

     if(!users || users.length==0){
        throw new Error("Users not found");
     }   

     // map in the users , n store only the things which are there inside fromUserId . 
    const senders = users.map(req=>req.fromUserId);

    // send the response in json format . 
    res.json({message : "interested request's fetched successfully ", data : senders});
    }
    catch(err){
       return  res.status(404).json({message :`Error : ${err.message}`})
    }
});

module.exports = userRouter;