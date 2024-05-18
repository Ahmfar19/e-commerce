const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Extract data from req.body to create the folder name

        const folderName = req.body.title; // Assuming folderName is a key in req.body

        const uploadPath = path.join(__dirname, '../../assets/images', folderName);

        // Check if the folder exists
        if (!fs.existsSync(uploadPath)) {
            // Create the folder using the dynamically generated folder name
            fs.mkdir(uploadPath, { recursive: true }, (err) => {
                if (err) {
                    console.error('Error creating folder:', err);
                    cb(err, null);
                } else {
                    cb(null, uploadPath);
                }
            });
        } else {
            cb(null, uploadPath);
        }
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname); // Keep the original file name
    },
});

const upload = multer({ storage });

module.exports = upload;
