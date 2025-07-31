const express = require("express");
const router = express.Router();
const heroSlidesController = require("../controllers/heroSlidesController");

// Public: Get all slides (e.g., for frontend)
router.get("/", heroSlidesController.getAllSlides);

// Public: Get single slide (optional)
router.get("/:id", heroSlidesController.getSlideById);

// Admin: Reorder slides — must come BEFORE "/:id"
router.put("/reorder", heroSlidesController.reorderSlides);

// Admin: Create slide
router.post("/", heroSlidesController.createSlide);

// Admin: Update slide
router.put("/:id", heroSlidesController.updateSlide);

// Admin: Delete slide
router.delete("/:id", heroSlidesController.deleteSlide);

module.exports = router;
