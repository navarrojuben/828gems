const mongoose = require("mongoose");

// Sub-schema with timestamps
const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // This enables createdAt and updatedAt for each image
);

const showcaseGallerySchema = new mongoose.Schema(
  {
    images: [imageSchema],
  },
  { timestamps: true } // This enables createdAt and updatedAt for the main document
);

// Singleton helper to always have exactly one document
showcaseGallerySchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({ images: [] });
  }
  return doc;
};

module.exports = mongoose.model("ShowcaseGallery", showcaseGallerySchema);
