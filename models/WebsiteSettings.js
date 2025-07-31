const mongoose = require('mongoose');

const websiteSettingsSchema = new mongoose.Schema(
  {
    logoTitle: {
      type: String,
      default: 'La Pensar',
    },
    logoSubtitle: {
      type: String,
      default: 'Private Resort and Events Place',
    },
    logoUrl: {
      type: String,
      default: '',
    },
    bannerUrl: {
      type: String,
      default: '',
    },
    showLogo: {
      type: Boolean,
      default: true,
    },
    showBanner: {
      type: Boolean,
      default: true,
    },
    messengerLink: {
      type: String,
      default: '', // Example: 'https://m.me/yourpageid'
    },

    // 🎨 Primary color settings
    primaryColor: {
      type: String,
      default: '#285b7a', // main
    },
    primaryDark: {
      type: String,
      default: '#0d404f', // darker shade
    },
    primaryLight: {
      type: String,
      default: '#4ab8e0', // lighter shade
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WebsiteSettings', websiteSettingsSchema);
