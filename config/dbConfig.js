const mongoose = require('mongoose');

const connect = mongoose.connect(process.env.MONGO_URL);

const connection = mongoose.connection;

connection.on('connected', () => {
    console.log("MongoDB is Connected");
});

connection.on('error', (err) => {
    console.log("Error in MongoDb connection",err);
});

module.exports = mongoose;