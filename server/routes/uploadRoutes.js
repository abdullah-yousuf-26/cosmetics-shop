const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware'); // Import the guards

// Re-add protect and admin here
router.post('/', protect, admin, upload.single('image'), (req, res) => {
  res.send({
    message: 'Image Uploaded',
    url: req.file.path,
  });
});

module.exports = router;