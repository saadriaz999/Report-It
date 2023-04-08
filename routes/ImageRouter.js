const express = require('express');
const imageController = require('../controllers/ImageController');


// making the router object
const imageRouter = express.Router();


// adding endpoints
imageRouter.get('/get/:complaintId', imageController.get_images);
imageRouter.post('/post/:complaintId', imageController.post_image);
imageRouter.delete('/delete/:imageId', imageController.delete_image);


module.exports = imageRouter
