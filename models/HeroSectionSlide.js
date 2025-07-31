const mongoose = require("mongoose");

const heroSectionSlideSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["image", "video"],
      required: true
    },
    src: {
      type: String,
      required: true
    },
    title: {
      text: { type: String },
      color: { type: String, default: "#ffffff" },
      visible: { type: Boolean, default: true }
    },
    subtitle: {
      text: { type: String },
      color: { type: String, default: "#ffffff" },
      visible: { type: Boolean, default: true }
    },
    description: {
      text: { type: String },
      color: { type: String, default: "#ffffff" },
      visible: { type: Boolean, default: true }
    },
    button: {
      text: { type: String },
      link: { type: String },
      visible: { type: Boolean, default: true },
      color: {
        type: String,
        enum: ["primary", "black", "white"],
        default: "primary"
      }
    },
    overlay: {
      enabled: { type: Boolean, default: true },
      color: {
        type: String,
        enum: ["black", "white"],
        default: "black"
      },
      opacity: { type: Number, default: 0.3 } // 0=transparent, 1=opaque
    },
    order: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeroSectionSlide", heroSectionSlideSchema);
