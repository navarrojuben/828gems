const express = require('express');
const router = express.Router();
const aboutContactController = require('../controllers/aboutContactController');

// About Routes
router.get('/about', aboutContactController.getAbout); // Get About
router.put('/about', aboutContactController.createOrUpdateAbout); // Create/Update About
router.delete('/about/image/:imageName', aboutContactController.deleteAboutImage); // Delete Image from About

// Contact Routes
router.get('/contact', aboutContactController.getContact); // Get Contact
router.put('/contact', aboutContactController.createOrUpdateContact); // Create/Update Contact

module.exports = router;
