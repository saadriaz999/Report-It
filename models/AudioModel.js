const mongoose = require('../models/MongoConnection.js')


// creating audio schema
const audioSchema = new mongoose.Schema({
    complaintId: mongoose.Schema.Types.ObjectId,
    data: Buffer,
    contentType: String
})


// creating collection in MongoDB by connecting schema
const Audio = mongoose.model('Audio', audioSchema);


module.exports = Audio
