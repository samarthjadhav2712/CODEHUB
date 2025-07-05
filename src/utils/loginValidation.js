const validator = require('validator');

const validateLoginData = (req)=>{
    const {emailid , password} = req.body;
    if(!emailid || !password){
        throw new Error("Email and password are required");
    }
    if(!validator.isEmail(emailid)){
        throw new Error("Email is not valid: " + emailid);
    }
   if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    }
}

module.exports = {
    validateLoginData,
};