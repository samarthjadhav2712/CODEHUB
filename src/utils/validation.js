const validator = require('validator');

const validateUserData = (req)=>{
    const {firstName , lastName , emailid , password ,  age , Gender , skills } = req.body;

    if(!firstName || !lastName || !emailid || !password){
        throw new Error("First name, last name, email and password are required");
    }
    if(!validator.isEmail(emailid)){
        throw new Error("Email is not valid: " + emailid);
    }
   if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    }
    if(skills.length > 10){
        throw new Error("Skills cannot exceed 10 items");
    }
}

module.exports = {
    validateUserData,
};