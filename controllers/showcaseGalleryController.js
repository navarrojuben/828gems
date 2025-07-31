const ShowcaseGallery = require("../models/showcaseGallery");

/**
 * Get limited number of images with optional skip (pagination)
 */
exports.getLimitedGallery = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    const gallery = await ShowcaseGallery.getSingleton();

    // Sort images by order (descending), then slice using skip & limit
    const sorted = [...gallery.images].sort((a, b) => b.order - a.order);
    const paginated = sorted.slice(skip, skip + limit);

    res.json({
      total: gallery.images.length,
      data: paginated,
    });
  } catch (err) {
    console.error("Error fetching limited gallery:", err);
    res.status(500).json({ error: "Server error." });
  }
};

/**
 * Get all images in the showcase gallery
 */
exports.getGallery = async (req, res) => {
  try {
    const gallery = await ShowcaseGallery.getSingleton();
    res.json(gallery.images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};

/**
 * Add multiple images to the gallery (with mirror protection)
 */
exports.addImages = async (req, res) => {
  try {
    const { images } = req.body; // expect: [{url, caption, order}]
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: "No images provided." });
    }

    const gallery = await ShowcaseGallery.getSingleton();

    const duplicates = [];
    const safeImages = [];

    for (const incoming of images) {
      const existing = gallery.images.find(
        (img) =>
          img.url === incoming.url &&
          img.caption === (incoming.caption || "") &&
          img.order === (incoming.order || 0)
      );

      if (existing) {
        const timeSinceCreated = Date.now() - new Date(existing._id.getTimestamp()).getTime();
        if (timeSinceCreated < 5000) {
          return res.status(429).json({
            message: "One or more images were just submitted recently. Please wait.",
          });
        }

        duplicates.push(incoming);
      } else {
        safeImages.push(incoming);
      }
    }

    if (safeImages.length === 0) {
      return res.status(409).json({
        message: "All submitted images already exist in the gallery.",
        duplicates,
      });
    }

    gallery.images.push(...safeImages);
    await gallery.save();

    res.status(201).json({
      message: `${safeImages.length} image(s) added successfully.`,
      images: gallery.images,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};


/**
 * Update a specific image by its _id
 */
exports.updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, caption, order } = req.body;

    const gallery = await ShowcaseGallery.getSingleton();
    const image = gallery.images.id(id);
    if (!image) {
      return res.status(404).json({ message: "Image not found." });
    }

    if (url !== undefined) image.url = url;
    if (caption !== undefined) image.caption = caption;
    if (order !== undefined) image.order = order;

    await gallery.save();
    res.json({ message: "Image updated successfully.", image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};

/**
 * Delete a specific image by its _id
 */
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params; // This `id` should be the _id of the subdocument to be removed

    const gallery = await ShowcaseGallery.getSingleton(); // Get the single gallery document

    // Use .pull() to remove the subdocument from the array by its _id
    // Mongoose's .pull() method is designed for this exact purpose with subdocument arrays.
    const initialLength = gallery.images.length;
    gallery.images.pull(id);

    // Check if an item was actually removed by comparing lengths
    if (gallery.images.length === initialLength) {
      // If the length hasn't changed, it means the provided ID was not found in the array
      return res.status(404).json({ message: "Media item not found in gallery." });
    }

    await gallery.save(); // Save the parent document to persist the change

    res.json({ message: "Media item deleted successfully." });
  } catch (err) {
    console.error("Error in deleteImage controller:", err); // Log the full error for debugging
    res.status(500).json({ error: "Server error during media item deletion." });
  }
};
