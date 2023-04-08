const multer = require("multer");
const mongoose = require("mongoose");
const Image = require("../models/ImageModel");


// Set up storage engine for multer
const storage = multer.memoryStorage();


// Set up multer middleware to handle image uploads
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // limit file size to 5MB
    fileFilter: function(req, file, cb) {
        // check file type to make sure it's an image
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'));
        }
        cb(null, true);
    }
}).single('image');


const get_images = function(req, res) {
    if (req.isAuthenticated()) {
        const complaintId = mongoose.Types.ObjectId(req.params.complaintId);

        Image.find({ complaintId: complaintId }, function(err, images) {
            if (err) {
                return res.status(500).send(err.message);
            } else if (!images || images.length === 0) {
                return res.status(404).send('No images found');
            } else {
                const result = [];
                images.forEach(function(image) {
                    const buffer = Buffer.from(image.data, 'binary');
                    result.push({
                        contentType: image.contentType,
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


const post_image = function(req, res) {
    if (req.isAuthenticated()) {
        upload(req, res, function (err) {
            if (err) {
                return res.status(400).send(err.message);
            }

            // create new image document
            const newImage = new Image({
                complaintId: req.params.complaintId,
                data: req.file.buffer,
                contentType: req.file.mimetype
            });

            // save image to database
            newImage.save(function (err) {
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


const delete_image = function(req, res) {
    if (req.isAuthenticated()) {
        const imageId = req.params.imageId;

        Image.findOneAndDelete({ _id: imageId }, function(err, image) {
            if (err) {
                return res.status(500).send(err.message);
            } else if (!image) {
                return res.status(404).send('Image not found');
            } else {
                res.status(200).send('Image deleted successfully');
            }
        });
    } else {
        res.status(400).render("login.ejs", {err: null});
    }
};


module.exports = {
    get_images,
    post_image,
    delete_image
};
