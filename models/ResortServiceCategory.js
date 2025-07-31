const mongoose = require("mongoose");

const ResortServiceCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,     // Enforces DB-level uniqueness
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  order: {
    type: Number,
    default: 0,       // Used for manual sorting
  },
  icon: {
    type: String,
    default: "",      // Icon URL or CSS class
  },
}, { timestamps: true }); // ✅ Adds createdAt & updatedAt

module.exports = mongoose.model("ResortServiceCategory", ResortServiceCategorySchema);
