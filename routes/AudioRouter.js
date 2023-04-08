const express = require('express');
const audioController = require('../controllers/AudioController');


// making the router object
const audioRouter = express.Router();


// adding endpoints
audioRouter.get('/get/:complaintId', audioController.get_audios);
audioRouter.post('/post/:complaintId', audioController.post_audio);
audioRouter.delete('/delete/:audioId', audioController.delete_audio);


module.exports = audioRouter
