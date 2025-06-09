const mongoose = require('mongoose');
const connectionString = require("../credentials/mongodb"); // importing the connection string from the credentials file
// we cant directly connect to the database using mongoose.connect() , because it sends a promise which may resolve or reject . 
// so we need to use async await to handle the promise and connect to the database.
const ConnectDB = async () => {
    await mongoose.connect(connectionString);
}

module.exports = ConnectDB;