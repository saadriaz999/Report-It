const Complaint = require('../models/ComplaintModel')
const validationUtils = require("../utils/ValidationUtils");
const filterUtils = require("../utils/FilterUtils")


const get_complaints = function(req, res) {
    if (req.isAuthenticated()) {

        Complaint.find({}, function(err, complaints) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                const filteredComplaints = filterUtils.filterComplaints(complaints, req.user.role, req.user.area)
                res.status(200).send(filteredComplaints);
            }
        })
    } else {
        res.status(400).redirect("/user/login");
    }
}


const get_complaint = function (req, res) {
    if (req.isAuthenticated()) {
        const complaintId = req.params.complaintId;

        Complaint.find({complaintId: complaintId}, function(err, complaints) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.send(complaints);
            }
        })
    } else {
        res.status(400).redirect("/user/login");
    }
}


const post_complaint = function (req, res) {
    if (req.isAuthenticated()) {
        // create new complaint object
        const complaint = new Complaint({
            userId: req.user._id,
            category: req.body.category,
            description: req.body.description,
            address: req.body.address,
            datetime: req.body.datetime,
        })

        const err = validationUtils.validateComplaint(complaint.toObject());
        if (err) {
            res.render("complaint.ejs", {err: err});
        } else {
            // save complaint to database
            complaint.save(function(err, complaint) {
                if (err) {
                    return res.status(500).send(err.message);
                } else {
                    return res.status(200).render('media.ejs', {complaintId: complaint.id});
                }
            })
        }
    } else {
        res.status(400).redirect("/user/login");
    }
}


const update_complaint = function (req, res) {
    if (req.isAuthenticated()) {
        const complaintId = req.params.complaintId;

        Complaint.updateOne({_id: complaintId}, req.body, function (err, complaint) {
            if (err) {
                res.status(500).send(err.message);
            } else if (!complaint) {
                res.status(404).send('Complaint not found');
            } else {
                res.status(200).send('Complaint updated successfully');
            }
        })
    } else {
        res.status(400).redirect("/user/login");
    }
}


const delete_complaint = function (req, res) {
    if (req.isAuthenticated()) {
        const complainId = req.params.complaintId;

        Complaint.findOneAndDelete({_id: complainId}, function (err, complaint) {
            if (err) {
                res.status(500).send(err.message);
            } else if (!complaint) {
                res.status(404).send('Complaint not found');
            } else {
                res.send('Complaint deleted successfully');
            }
        })
    } else {
        res.status(400).redirect("/user/login");
    }
}


const get_complaint_page = function(req, res) {
    if (req.isAuthenticated()) {
        res.status(200).render("complaint.ejs", {err: null});
    } else {
        res.status(400).redirect("/user/login");
    }
}


const get_media_page = function(req, res) {
    if (req.isAuthenticated()) {
        res.status(200).render("media.ejs", {err: null});
    } else {
        res.status(400).redirect("/user/login");
    }
}


const get_crime_hotspot_page = function(req, res) {
    if (req.isAuthenticated()) {
        res.status(200).render("crime_hotspots.ejs");
    } else {
        res.status(400).redirect("/user/login");
    }
}

const get_crime_graphs_page = function(req, res) {
    if (req.isAuthenticated()) {
        res.status(200).render("graphs.ejs");
    } else {
        res.status(400).redirect("/user/login");
    }
}


module.exports = {
    get_complaints,
    get_complaint,
    post_complaint,
    update_complaint,
    delete_complaint,
    get_complaint_page,
    get_media_page,
    get_crime_hotspot_page,
    get_crime_graphs_page
};
