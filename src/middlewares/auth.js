const auth = (req,res,next)=>{
    console.log("Admin auth is getting checked");
    const token = "xyz";

    const isAdminAuthorized = token === "xy";
    if(isAdminAuthorized){
        console.log("Admin is authorized");
        next(); // call the next middleware or route handler with matching route . 
    } else {
        console.log("Admin is not authorized");
        res.status(403).send("Forbidden: Admin access required");
    }
}

module.exports = {
    auth,
};