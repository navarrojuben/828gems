const { About, Contact } = require('../models/aboutContactModel');
const fs = require('fs');
const path = require('path');

// Helper function for deleting files asynchronously
const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// ------------------- About Section Controller -------------------

// Create or Update About Data
const createOrUpdateAbout = async (req, res) => {
  const { title, description, images } = req.body;
  try {
    let about = await About.findOne();

    if (!about) {
      about = new About({ title, description, images });
    } else {
      about.title = title;
      about.description = description;
      about.images = images;
    }

    await about.save();
    res.status(200).json(about);
  } catch (error) {
    res.status(500).json({ message: 'Error creating/updating About section', error: error.message });
  }
};

// Get About Data
const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({ message: "About data not found" });
    }
    res.status(200).json(about);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching About data', error: error.message });
  }
};

// Delete Image from About Section
const deleteAboutImage = async (req, res) => {
  const { imageName } = req.params;
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({ message: "About data not found" });
    }

    const imageIndex = about.images.indexOf(imageName);
    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found in About section" });
    }

    about.images.splice(imageIndex, 1);
    await about.save();

    const imagePath = path.join(__dirname, '..', 'uploads', imageName);
    await deleteFile(imagePath);

    res.status(200).json({ message: "Image removed successfully from About section" });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting image from About section', error: error.message });
  }
};

// ------------------- Contact Section Controller -------------------

// ✅ Create or Update Contact Data (now with coordinates support)
const createOrUpdateContact = async (req, res) => {
  const { email, phone, address, socialLinks, contactPerson, coordinates } = req.body;

  try {
    let contact = await Contact.findOne();

    if (!contact) {
      contact = new Contact({
        email,
        phone,
        address,
        socialLinks,
        contactPerson,
        coordinates
      });
    } else {
      contact.email = email;
      contact.phone = phone;
      contact.address = address;
      contact.socialLinks = socialLinks;
      contact.contactPerson = contactPerson;
      contact.coordinates = coordinates; // ✅ Update coordinates
    }

    await contact.save();
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error creating/updating Contact section', error: error.message });
  }
};

// Get Contact Data
const getContact = async (req, res) => {
  try {
    const contact = await Contact.findOne();
    if (!contact) {
      return res.status(404).json({ message: "Contact data not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Contact data', error: error.message });
  }
};

// ------------------- Exporting Controller Functions -------------------
module.exports = {
  createOrUpdateAbout,
  getAbout,
  deleteAboutImage,
  createOrUpdateContact,
  getContact
};
