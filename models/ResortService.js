const mongoose = require("mongoose");

const ResortServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  moreInfo: {
    type: String,
    required: true,
  },
  inclusions: {
    type: [String],
    default: [],
  },
  images: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  stocks: {
    type: Number,
    default: 0,
    min: 0,
  },
}, { timestamps: true }); // ✅ Enables createdAt and updatedAt

module.exports = mongoose.model("ResortService", ResortServiceSchema);
