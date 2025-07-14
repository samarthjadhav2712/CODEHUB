const express = require('express');
const {userAuth} = require('../middlewares/auth');
const {validateProfileEditData , validatePassword} = require('../utils/validation');
const bcrypt = require('bcrypt');

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth , async(req,res)=>{
    try{
    const user = req.user;
    res.send(user); // sending the user data to the client
    }
    catch(err){
        return res.status(400).send("Error fetching profile data"+ err.message);
    }
});

profileRouter.patch("/profile/edit" , userAuth , async(req,res)=>{
    try{
        if(!validateProfileEditData(req)){
            throw new Error("Invalid edit request");
        }
    
        const loggedInUser = req.user;

        //It updates the loggedInUser object by assigning each field from the incoming request (req.body) to it, so only the fields sent by the user get changed.
        Object.keys(req.body).forEach((field)=>{
            loggedInUser[field] = req.body[field];
        });

        console.log(loggedInUser);

        await loggedInUser.save();

        // res.send(`${loggedInUser.firstName},  Profile updated Successfully !`);

        //good industry way to write code 
        res.json({
            message :`${loggedInUser.firstName },your profile updated successfully`,
            data : loggedInUser
        });
    }
    catch(err){
        res.status(400).send("error is  :"+err.message);
    }
});

profileRouter.patch("/profile/password" , userAuth  , async(req,res)=>{
    try{
        validatePassword(req);

        const loggedInUser = req.user;
        // check for old password , before allowing update . 
        const{oldpassword} = req.body;

        const isMatch = bcrypt.compare(oldpassword , loggedInUser.password);
        if(!isMatch){
            throw new Error("Entered Old password is incorrect");
        }

        // hash the new password
        const {password} = req.body;
        const hashedPassword = await bcrypt.hash(password , 10);
        
        // override & save to DB . 
        loggedInUser.password = hashedPassword;
        await loggedInUser.save(); // important to persist change in DB .

        // res.send(`${loggedInUser.firstName} , password updated successfully `);
        res.json({message : "Password updated Successfully !"});
    }
    catch(err){
        return res.status(400).send("Error :"+err.message);
    }
});

module.exports = profileRouter;