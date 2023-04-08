const mongoose = require('../models/MongoConnection.js')


// creating image schema
const imageSchema = new mongoose.Schema({
    complaintId: mongoose.Schema.Types.ObjectId,
    data: Buffer,
    contentType: String
})


// creating collection in MongoDB by connecting schema
const Image = mongoose.model('Image', imageSchema);


module.exports = Image
