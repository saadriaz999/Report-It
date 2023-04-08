const express = require('express');
const videoController = require('../controllers/VideoController');


// making the router object
const videoRouter = express.Router();


// adding endpoints
videoRouter.get('/get/:complaintId', videoController.get_videos);
videoRouter.post('/post/:complaintId', videoController.post_video);
videoRouter.delete('/delete/:videoId', videoController.delete_video);


module.exports = videoRouter
