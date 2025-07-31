const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    type: { type: String, required: true }, // e.g., 'image', 'video' (derived from mimetype)
    size: { type: Number, required: true }, // Size in bytes
    originalName: { type: String, required: true }, // Original file name from upload
    name: { type: String, default: "" }, // Optional custom display name
  },
  { timestamps: true }
);

module.exports = mongoose.model('Media', mediaSchema);