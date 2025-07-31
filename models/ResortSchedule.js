const mongoose = require("mongoose");

const ResortScheduleSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  contactInfo: {
    phone: { type: String, required: true },
    email: { type: String },
  },
  service: {
    type: String,
    required: true, // e.g., "Island Hopping Tour"
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String, // e.g., '14:30'
    default: "",
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1,
  },
  notes: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  images: {
    type: [String], // Array of image URLs
    default: [],
  }
}, { timestamps: true }); // 🔁 Adds createdAt and updatedAt

module.exports = mongoose.model("ResortSchedule", ResortScheduleSchema);
