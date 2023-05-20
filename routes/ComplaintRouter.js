const express = require('express');
const complaintController = require('../controllers/ComplaintController');


// making the router object
const complaintRouter = express.Router();


// adding endpoints
complaintRouter.post('/post', complaintController.post_complaint);
complaintRouter.get('/get', complaintController.get_complaints)
complaintRouter.get('/get/:complaintId', complaintController.get_complaint);
complaintRouter.put('/update/:complaintId', complaintController.update_complaint);
complaintRouter.delete('/delete/:complaintId', complaintController.delete_complaint);
complaintRouter.get('/post', complaintController.get_complaint_page);
complaintRouter.get('/media', complaintController.get_media_page);
complaintRouter.get('/hotspots', complaintController.get_crime_hotspot_page);
complaintRouter.get('/graphs', complaintController.get_crime_graphs_page);


module.exports = complaintRouter
