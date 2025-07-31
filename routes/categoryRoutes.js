const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware'); // Your auth middleware

// Assuming protectAdmin is your primary authentication check.
// If you have different roles (e.g., 'master' vs 'admin'),
// you'd add another middleware after protectAdmin to check roles.

router.route('/')
  .post(authMiddleware.protectAdmin, categoryController.createCategory) // Authenticated (admin)
  .get(categoryController.getCategories); // Can be public or authenticated based on needs

router.route('/:id')
  .get(categoryController.getCategoryById) // Can be public or authenticated
  .put(authMiddleware.protectAdmin, categoryController.updateCategory) // Authenticated (admin)
  .delete(authMiddleware.protectAdmin, categoryController.deleteCategory); // Authenticated (admin)

// NEW ROUTES for managing media within a category
router.route('/:id/addMedia' )
  .put(authMiddleware.protectAdmin, categoryController.addMediaToCategory); // Authenticated (admin)

router.route('/:id/removeMedia')
  .put(authMiddleware.protectAdmin, categoryController.removeMediaFromCategory); // Authenticated (admin)

module.exports = router;