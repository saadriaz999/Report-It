const mongoose = require('../models/MongoConnection.js')


// creating complaint schema
const complaintSchema = new mongoose.Schema({
    userId: String,
    category: String,
    description: String,
    address: String,
    datetime: Date
})


// creating collection in MongoDB by connecting schema
const Complaint = mongoose.model('Complaint', complaintSchema);


module.exports = Complaint
