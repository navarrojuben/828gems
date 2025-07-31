// models/Faq.js
const mongoose = require("mongoose");

const FaqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
    category: {
      type: String, // Optional, for grouping (e.g., "Booking", "Facilities", etc.)
      default: "General",
    },
    order: {
      type: Number,
      default: 0, // Used to control display order
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Faq", FaqSchema);
