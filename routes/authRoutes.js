const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  changePassword
} = require('../controllers/authController');

// 🚨 WARNING: Only enable register route to create the first admin, then disable or protect it!
router.post('/register', registerAdmin);

// Login route
router.post('/login', loginAdmin);

// Change password route
router.post('/change-password', changePassword);

module.exports = router;
