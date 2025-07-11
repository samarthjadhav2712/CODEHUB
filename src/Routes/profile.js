const express = require('express');
const {userAuth} = require('../middlewares/auth');

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth , async(req,res)=>{
    try{
    const user = req.user;
    res.send(user); // sending the user data to the client
    }
    catch(err){
        return res.status(400).send("Error fetching profile data"+ err.message);
    }
});

module.exports = profileRouter;