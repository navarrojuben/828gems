const ResortServiceCategory = require("../models/ResortServiceCategory");

// GET all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await ResortServiceCategory.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE category (with mirror prevention)
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const existing = await ResortServiceCategory.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') }, // Case-insensitive match
      description: description || "",
    });

    if (existing) {
      const timeSinceCreated = Date.now() - new Date(existing.createdAt).getTime();
      if (timeSinceCreated < 5000) {
        return res.status(429).json({ message: "Duplicate category just submitted. Please wait." });
      }
      return res.status(409).json({ message: "Category with the same name and description already exists." });
    }

    const newCategory = new ResortServiceCategory({ name, description });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE category
exports.updateCategory = async (req, res) => {
  try {
    const updated = await ResortServiceCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE category
exports.deleteCategory = async (req, res) => {
  try {
    await ResortServiceCategory.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
