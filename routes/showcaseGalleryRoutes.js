const express = require("express");
const router = express.Router();
const showcaseGalleryController = require("../controllers/showcaseGalleryController");

// New limited/paginated route
router.get("/limited", showcaseGalleryController.getLimitedGallery);

// GET all images in the gallery
router.get("/", showcaseGalleryController.getGallery);

// ADD one or more images
router.post("/", showcaseGalleryController.addImages);

// UPDATE a specific image by its _id
router.put("/:id", showcaseGalleryController.updateImage);

// DELETE a specific image by its _id
router.delete("/:id", showcaseGalleryController.deleteImage);

module.exports = router;
