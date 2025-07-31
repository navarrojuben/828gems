const WebsiteSettings = require('../models/WebsiteSettings');

// GET: Fetch website settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = new WebsiteSettings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Error fetching settings' });
  }
};

// PUT: Update website settings
exports.updateSettings = async (req, res) => {
  try {
    const {
      logoTitle,
      logoSubtitle,
      logoUrl,
      bannerUrl,
      showLogo,
      showBanner,
      messengerLink,
      primaryColor,
      primaryDark,
      primaryLight,
    } = req.body;

    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = new WebsiteSettings();
    }

    if (logoTitle !== undefined) settings.logoTitle = logoTitle;
    if (logoSubtitle !== undefined) settings.logoSubtitle = logoSubtitle;
    if (logoUrl !== undefined) settings.logoUrl = logoUrl;
    if (bannerUrl !== undefined) settings.bannerUrl = bannerUrl;
    if (showLogo !== undefined) settings.showLogo = showLogo;
    if (showBanner !== undefined) settings.showBanner = showBanner;
    if (messengerLink !== undefined) settings.messengerLink = messengerLink;

    // ✅ Save color theme values
    if (primaryColor !== undefined) settings.primaryColor = primaryColor;
    if (primaryDark !== undefined) settings.primaryDark = primaryDark;
    if (primaryLight !== undefined) settings.primaryLight = primaryLight;

    await settings.save();
    res.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Error updating settings' });
  }
};
