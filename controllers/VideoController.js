const multer = require("multer");
const mongoose = require("mongoose");
const Video = require("../models/VideoModel");


// Set up storage engine for multer
const storage = multer.memoryStorage();


const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 50 }, // limit file size to 50MB
    fileFilter: function(req, file, cb) {
        if (!file.mimetype.startsWith('video/')) {
            return cb(new Error('Only video files are allowed'));
        }
        cb(null, true);
    }
}).single('video');


const get_videos = function(req, res) {
    if (req.isAuthenticated()) {
        const complaintId = mongoose.Types.ObjectId(req.params.complaintId);

        Video.find({ complaintId: complaintId }, function(err, videos) {
            if (err) {
                return res.status(500).send(err.message);
            } else if (!videos || videos.length === 0) {
                return res.status(404).send('No Videos found');
            } else {
                const result = [];
                videos.forEach(function(video) {
                    const buffer = Buffer.from(video.data, 'binary');
                    result.push({
                        contentType: video.contentType,
                        data: buffer
                    });
                });
                res.send(result);
            }
        });
    } else {
        res.status(400).render("login.ejs", {err: null});
    }
};


const post_video = function(req, res) {
    if (req.isAuthenticated()) {
        upload(req, res, function (err) {
            if (err) {
                return res.status(400).send(err.message);
            }

            // create new video document
            const newVideo = new Video({
                complaintId: req.params.complaintId,
                data: req.file.buffer,
                contentType: req.file.mimetype
            });

            // save video to database
            newVideo.save(function (err) {
                if (err) {
                    console.log(err)
                    return res.status(500).send(err.message);
                } else {
                    return res.status(200).render("media.ejs", {complaintId: req.params.complaintId});
                }
            });
        });
    } else {
        res.status(400).render("login.ejs", {err: null});
    }
}


const delete_video = function(req, res) {
    if (req.isAuthenticated()) {
        const videoId = req.params.videoId;

        Video.findOneAndDelete({ _id: videoId }, function(err, video) {
            if (err) {
                return res.status(500).send(err.message);
            } else if (!video) {
                return res.status(404).send('Video not found');
            } else {
                res.status(200).send('Video deleted successfully');
            }
        });
    } else {
        res.status(400).render("login.ejs", {err: null});
    }
};


module.exports = {
    get_videos,
    post_video,
    delete_video
}
