const mongoose = require('../models/MongoConnection.js')


// creating video schema
const videoSchema = new mongoose.Schema({
    complaintId: mongoose.Schema.Types.ObjectId,
    data: Buffer,
    contentType: String
})


// creating collection in MongoDB by connecting schema
const Video = mongoose.model('Video', videoSchema);


module.exports = Video
