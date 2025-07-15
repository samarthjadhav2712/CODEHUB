const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Types.ObjectId,
        required : true,
        ref : "User"
    },
    toUserID : {
        type : mongoose.Types.ObjectId,
        required : true 
    },
    status : {
        type : String ,
        // enum used to restrict the user with particular values .
        enum : {
            values : ["interested" , "ignored" , "rejected" , "accepted"],
            message : `{VALUE} , not a valid status `, 
        },
    },
},{
    timestamps : true,
});

// in order to avoid user to send connection request to themself .
connectionRequestSchema.pre("save",function(next){
    const user = this;
    if(user.fromUserId.equals(user.toUserID)){
        throw new Error("Cannot send connection request to yourself");
    }
    next();
});

connectionRequestSchema.index({fromUserId : 1 , toUserID : 1});

const ConnectionRequest = mongoose.model("ConnectionRequest" , connectionRequestSchema);

module.exports = {
    ConnectionRequest
};