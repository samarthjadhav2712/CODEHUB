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

userRouter.get("/user/connections",userAuth , async(req,res)=>{
    try{
    const loggedInUser = req.user;
    
    // get the users where either fromuserid / touserid is loggedinUser & status is accepted .
    const user = await ConnectionRequest.find({
  $or: [
    { fromUserId: loggedInUser._id, status: "accepted" },
    { toUserID: loggedInUser._id, status: "accepted" }
  ]
})
.populate("fromUserId", "firstName lastName")
.populate("toUserID", "firstName lastName");

    if(!user || user.length==0){
        throw new Error("user not found");
    }

    //If you want your connections list to always show the other user in the connection, you need this check.
    const connections = user.map(req =>{
        if(req.fromUserId._id.toString() === loggedInUser._id.toString()){
            return req.toUserID;
        }
        return req.fromUserId;
    });

    res.json({message : `all the connections of ${loggedInUser.firstName} are listed below : `,
    data : connections});
    }
    catch(err){
        return res.status(400).json({message : `Error : ${err.message}`});
    }
});

module.exports = userRouter ;