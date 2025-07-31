const mongoose = require('mongoose');

// About Section Schema
const aboutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
});

// Contact Section Schema
const contactSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },

  // ➕ Coordinates (lat/lng)
  coordinates: {
    lat: { type: Number, default: 13.736717 },  // Optional default
    lng: { type: Number, default: 100.523186 },
  },

  socialLinks: {
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
  },
  contactPerson: {
    name: { type: String },
    title: { type: String },
    email: { type: String },
    phone: { type: String },
  },
});

// Models
const About = mongoose.model('About', aboutSchema);
const Contact = mongoose.model('Contact', contactSchema);

module.exports = { About, Contact };
