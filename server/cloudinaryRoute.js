const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const router = express.Router();
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET
});

// Multer Configuration (for handling file uploads)
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

function uploadToCloudinary(file, resourceType, folder, res) {
    const uploadOptions = {
        resource_type: resourceType,
        folder: folder
    };

    cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ url: result.secure_url });
    }).end(file);
}

// Route to handle image uploads
router.post('/image', upload.single('image'), (req, res) => {
    uploadToCloudinary(req.file.buffer, 'image', 'images-articles', res);
});

// Route to handle video uploads
router.post('/video', upload.single('video'), (req, res) => {
    uploadToCloudinary(req.file.buffer, 'video', 'videos-articles', res);
});

// Route to handle profile picture uploads
router.post('/profile-picture', upload.single('image'), (req, res) => {
    uploadToCloudinary(req.file.buffer, 'image', 'profile-pictures', res);
});


module.exports = router;
