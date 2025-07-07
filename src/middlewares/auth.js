const jwt = require('jsonwebtoken');
const User = require("../models/user"); // importing the user model

const userAuth = async(req,res,next)=>{
    try{  
// read the token from the req cookies .
    const {jwt_token} = req.cookies;
    if(!jwt_token){
        throw new Error("No token found in cookies");
    }

//validate the token .
    const decodedMessage = await jwt.verify(jwt_token , "secretkey"); // verify the token using the secret key

    if(!decodedMessage){
        throw new Error ("Invalid token");
    }

    const {_id} = decodedMessage; // extract the user id from the decoded JWT

// find the user .
    const user = await User.findById(_id);
    if(!user){
       throw new Error("User not found");
    }

    req.user = user; // attach the user to the request object
    next();
    }
    catch(err){
        res.status(400).send("Unauthorized access, please login again"+err.message);
    }
};

module.exports = {
    userAuth,
};