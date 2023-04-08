const mongoose = require("mongoose");


// connecting to MongoDB
const connectionString = 'mongodb://127.0.0.1:27017/WebDevProject';
mongoose.set('strictQuery', true);
mongoose.connect(connectionString);


module.exports = mongoose;
