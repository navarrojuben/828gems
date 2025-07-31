const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/websiteSettingsController');
const { protectAdmin } = require('../middleware/authMiddleware');

// Anyone can get settings (public)
router.get('/', getSettings);

// Only authenticated admin can update
router.put('/', updateSettings);

module.exports = router;
