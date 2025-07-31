const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getMedia, uploadMedia, deleteMedia, getUsage } = require('../controllers/mediaController');
const { protectAdmin } = require('../middleware/authMiddleware');

// ─────────────────────────────────────────────
// Multer config
// ─────────────────────────────────────────────

// Use memory storage so nothing is saved to disk
const storage = multer.memoryStorage();

// Accept common image and video types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'));
  }
};

// Set 10MB size limit
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
});

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────

router.get('/', getMedia);
router.post('/', protectAdmin, upload.single('file'), uploadMedia);
router.delete('/:id', protectAdmin, deleteMedia);
router.get('/usage', getUsage);

module.exports = router;
