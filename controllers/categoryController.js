const Category = require('../models/Category');
const Media = require('../models/Media'); // Needed for validating media IDs

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private (Admin)
 */
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    // Check for exact match (case-insensitive) and same description
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      description: description || "", // if undefined, match as empty string
    });

    if (existingCategory) {
      // Check if it's very recent (within 5 seconds)
      const timeSinceCreated = Date.now() - new Date(existingCategory.createdAt).getTime();
      if (timeSinceCreated < 5000) {
        return res.status(429).json({
          message: "Duplicate category just submitted. Please wait a few seconds.",
        });
      }

      return res.status(409).json({ message: "Category with this name and description already exists." });
    }

    const newCategory = new Category({
      name,
      description,
      media: [], // Initialize with an empty media array
    });

    const savedCategory = await newCategory.save();
    res.status(201).json({
      message: "Category created successfully.",
      category: savedCategory,
    });
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ error: "Server error during category creation." });
  }
};


/**
 * @desc    Get all categories (with populated media)
 * @route   GET /api/categories
 * @access  Public (or Private)
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('media') // Populate the 'media' array to get full media asset details
      .sort({ name: 1 });
    res.status(200).json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Server error during fetching categories." });
  }
};

/**
 * @desc    Get a single category by ID (with populated media)
 * @route   GET /api/categories/:id
 * @access  Public (or Private)
 */
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id).populate('media'); // Populate media for single fetch

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json(category);
  } catch (err) {
    console.error("Error fetching category by ID:", err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid category ID format." });
    }
    res.status(500).json({ error: "Server error during fetching category." });
  }
};

/**
 * @desc    Update an existing category (name and description only)
 * @route   PUT /api/categories/:id
 * @access  Private (Admin)
 */
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name cannot be empty." });
    }

    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: id }
    });
    if (existingCategory) {
      return res.status(409).json({ message: "Another category with this name already exists." });
    }

    // Find and update the category. Note: 'media' array is not updated here directly.
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    ).populate('media'); // Populate to return current media with updated category

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json({
      message: "Category updated successfully.",
      category: updatedCategory,
    });
  } catch (err) {
    console.error("Error updating category:", err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid category ID format." });
    }
    res.status(500).json({ error: "Server error during category update." });
  }
};

/**
 * @desc    Add media assets to a category's media array
 * @route   PUT /api/categories/:id/addMedia
 * @access  Private (Admin)
 */
exports.addMediaToCategory = async (req, res) => {
  try {
    const { id } = req.params; // Category ID
    const { mediaIds } = req.body; // Array of Media document _ids to add

    if (!mediaIds || !Array.isArray(mediaIds) || mediaIds.length === 0) {
      return res.status(400).json({ message: "No media IDs provided." });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Validate if all provided mediaIds exist in the Media collection
    const existingMediaAssets = await Media.find({ _id: { $in: mediaIds } });
    if (existingMediaAssets.length !== mediaIds.length) {
      const foundIds = existingMediaAssets.map(m => m._id.toString());
      const notFoundIds = mediaIds.filter(id => !foundIds.includes(id));
      return res.status(400).json({ message: `Some media assets not found: ${notFoundIds.join(', ')}` });
    }

    // Add unique media IDs to the category's media array
    // $addToSet ensures no duplicate media IDs are added
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $addToSet: { media: { $each: mediaIds } } }, // Add each ID if not already present
      { new: true }
    ).populate('media'); // Populate the updated media list for the response

    res.status(200).json({
      message: "Media added to category successfully.",
      category: updatedCategory,
    });
  } catch (err) {
    console.error("Error adding media to category:", err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid ID format in request body." });
    }
    res.status(500).json({ error: "Server error during adding media to category." });
  }
};

/**
 * @desc    Remove media assets from a category's media array
 * @route   PUT /api/categories/:id/removeMedia
 * @access  Private (Admin)
 */
exports.removeMediaFromCategory = async (req, res) => {
  try {
    const { id } = req.params; // Category ID
    const { mediaIds } = req.body; // Array of Media document _ids to remove

    if (!mediaIds || !Array.isArray(mediaIds) || mediaIds.length === 0) {
      return res.status(400).json({ message: "No media IDs provided for removal." });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Remove specified media IDs from the category's media array
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $pullAll: { media: mediaIds } }, // Remove all specified IDs
      { new: true }
    ).populate('media'); // Populate the updated media list for the response

    res.status(200).json({
      message: "Media removed from category successfully.",
      category: updatedCategory,
    });
  } catch (err) {
    console.error("Error removing media from category:", err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid ID format in request body." });
    }
    res.status(500).json({ error: "Server error during removing media from category." });
  }
};

/**
 * @desc    Delete a category
 * @route   DELETE /api/categories/:id
 * @access  Private (Admin)
 */
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params ;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found." });
    }

    // IMPORTANT: When a category is deleted, the actual Media documents are NOT deleted.
    // They are simply no longer referenced by this specific category.
    // Media assets remain available in the general media library.

    res.status(200).json({ message: "Category deleted successfully." });
  } catch (err) {
    console.error("Error deleting category:", err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid category ID format." });
    }
    res.status(500).json({ error: "Server error during category deletion." });
  }
};