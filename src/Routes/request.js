const express = require('express');
const {userAuth} = require('../middlewares/auth');
const { ConnectionRequest } = require('../models/connectionRequest');
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserID", userAuth ,async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserID = req.params.toUserID;
        const status = req.params.status;
        const loggedInUser = req.user;

        // to check if there is already existing request / connection between the user . 
        const existingConnection = await ConnectionRequest.findOne({
            $or :[
                {fromUserId , toUserID},
                {fromUserId : toUserID , toUserID : fromUserId}
            ],
        });

        if(existingConnection){
            throw new Error("Connection request already present ");
        }
        
        // to get the user to whom we r sending the request
        const user = await User.findById(toUserID);
        if(!user){
            throw new Error("User not found ");
        }   

        // to allow only specific status , so that user cant add on the status as accepted .
        const allowedStatus = [
            "interested", 
            "ignored"
        ];

        if(!allowedStatus.includes(status)){
            throw new Error("Invalid Status type ");
        }

        // to add on to the DB 
        const connection = new ConnectionRequest({
            fromUserId , 
            toUserID , 
            status
        });

        await connection.save();

        res.json({
            message:`${loggedInUser.firstName},has succesfully sent ${status} request to ${user.firstName}`,
            data : connection
        });
    }
    catch(err){
        return res.status(400).json("Error : "+err.message);
    }
});

module.exports = requestRouter;