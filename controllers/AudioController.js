const multer = require("multer");
const mongoose = require("mongoose");
const Audio = require("../models/AudioModel");


// Set up storage engine for multer
const storage = multer.memoryStorage();


const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 50 }, // limit file size to 50MB
    fileFilter: function(req, file, cb) {
        if (!file.mimetype.startsWith('audio/')) {
            return cb(new Error('Only audio files are allowed'));
        }
        cb(null, true);
    }
}).single('audio');


const get_audios = function(req, res) {
    if (req.isAuthenticated()) {
        const complaintId = mongoose.Types.ObjectId(req.params.complaintId);

        Audio.find({ complaintId: complaintId }, function(err, audios) {
            if (err) {
                return res.status(500).send(err.message);
            } else if (!audios || audios.length === 0) {
                return res.status(404).send('No audios found');
            } else {
                const result = [];
                audios.forEach(function(audio) {
                    const buffer = Buffer.from(audio.data, 'binary');
                    result.push({
                        contentType: audio.contentType,
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


const post_audio = function(req, res) {
    if (req.isAuthenticated()) {
        upload(req, res, function (err) {
            if (err) {
                return res.status(400).send(err.message);
            }

            // create new audio document
            const newAudio = new Audio({
                complaintId: req.params.complaintId,
                data: req.file.buffer,
                contentType: req.file.mimetype
            });

            // save audio to database
            newAudio.save(function (err) {
                if (err) {
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


const delete_audio = function(req, res) {
    if (req.isAuthenticated()) {
        const audioId = req.params.audioId;

        Audio.findOneAndDelete({_id: audioId}, function (err, audio) {
            if (err) {
                return res.status(500).send(err.message);
            } else if (!audio) {
                return res.status(404).send('Audio not found');
            } else {
                res.status(200).send('Audio deleted successfully');
            }
        });
    } else {
        res.status(400).render("login.ejs", {err: null});
    }
};


module.exports = {
    get_audios,
    post_audio,
    delete_audio
}
