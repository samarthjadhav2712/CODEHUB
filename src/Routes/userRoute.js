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

const USER_SAFE_DATA = ["firstName" , "lastName" , "age" , "Gender" , "skills"];

userRouter.get("/user/feed" , userAuth , async(req,res)=>{
    /*
        conditions to build this API :
        1) user shld'nt see the cards where the user has already sent interested / rejected response to it .
        2) user shld'nt see the cards , if that card is already in its connection . 
        3) user shld'nt see themself in the feed card . 

        connections in db - > ( max - sunil , samarth-sunil , samarth - shruti )
    */
   try{
    const loggedInUser = req.user;

    // get the users , where loggedin user is in connection .
    const connections = await ConnectionRequest.find({
        $or : [{fromUserId : loggedInUser._id} , {toUserID : loggedInUser._id}],
    }).select( "fromUserId toUserID");

    if(!connections || connections.length==0){
        throw new Error("No feed / users found !!");
    }

    // store the unique users in set
    const hideUsersFromFeed = new Set();
    connections.forEach((req)=>{
        hideUsersFromFeed.add(req.fromUserId),
        hideUsersFromFeed.add(req.toUserID)
    });

    const users = await User.find({
        _id : {$nin : Array.from(hideUsersFromFeed)},
    }).select(USER_SAFE_DATA);

    res.json({message : `Below is the feed for ${loggedInUser.firstName} : `, data : users});
    }
    catch(err){
        return res.status(400).json({message :`Error : ${err.message}`});
    }
});

module.exports = userRouter ;