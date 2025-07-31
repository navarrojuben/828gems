const Media = require('../models/Media');
const Category = require('../models/Category'); // Need Category model to update references on delete
const ShowcaseGallery = require('../models/showcaseGallery'); // Assuming this still exists and needs updating
const { cloudinary } = require('../utils/cloudinary');
const streamifier = require('streamifier');

// GET all media assets (does not filter by category here; AdminCategories handles categorization)
exports.getMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (error) {
    console.error("Error fetching all media:", error);
    res.status(500).json({ message: 'Error fetching media assets.' });
  }
};

// POST upload media asset (does NOT assign category here; categories will reference this asset later)
exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const file = req.file;
    const mediaType = file.mimetype.startsWith('video') ? 'video' : 'image';

    // 🔒 Step 1: Check for existing media (mirror detection)
    const existing = await Media.findOne({
      originalName: file.originalname,
      size: file.size,
      type: mediaType,
    });

    if (existing) {
      const timeSinceUpload = Date.now() - new Date(existing.createdAt).getTime();
      if (timeSinceUpload < 5000) {
        return res.status(429).json({
          message: 'Duplicate media just uploaded. Please wait a few seconds.',
        });
      }
      return res.status(409).json({
        message: 'Media with same original name and size already exists.',
      });
    }

    // ✅ Step 2: Upload to Cloudinary
    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload();

    // ✅ Step 3: Save in MongoDB
    const newMedia = await Media.create({
      url: result.secure_url,
      type: mediaType,
      public_id: result.public_id,
      size: file.size,
      originalName: file.originalname,
      name: "", // Can be renamed later
    });

    res.json(newMedia);
  } catch (error) {
    console.error("Error uploading media:", error);
    res.status(500).json({ message: 'Error uploading media asset.' });
  }
};


// DELETE media asset (removes from Cloudinary, DB, and any referencing categories/galleries)
exports.deleteMedia = async (req, res) => {
  const { id } = req.params; // ID of the Media document to delete
  try {
    const media = await Media.findById(id);
    if (!media) {
      return res.status(404).json({ message: 'Media asset not found.' });
    }

    // 1. Remove this media's ID from ALL Category documents' 'media' array
    await Category.updateMany(
      { media: media._id }, // Find categories that contain this media ID
      { $pull: { media: media._id } } // Remove the media ID from their 'media' array
    );
    console.log(`Media ID ${media._id} removed from all referencing categories.`);

    // 2. Remove this media's URL from ShowcaseGallery (if applicable)
    // Assuming ShowcaseGallery.images stores URLs. If it stores _id, this logic changes.
    // If ShowcaseGallery is no longer used or is structured differently, remove this block.
    let galleryItemsRemoved = 0;
    if (ShowcaseGallery) {
      const gallery = await ShowcaseGallery.getSingleton();
      if (gallery) {
        const initialGalleryLength = gallery.images.length;
        gallery.images = gallery.images.filter((img) => img.url !== media.url);
        if (gallery.images.length !== initialGalleryLength) {
          galleryItemsRemoved = initialGalleryLength - gallery.images.length;
          await gallery.save();
          console.log(`Removed ${galleryItemsRemoved} entries from ShowcaseGallery.`);
        }
      }
    }

    // 3. Delete from Cloudinary
    const resourceType = media.type === 'video' ? 'video' : 'image'; // Use stored type
    await cloudinary.uploader.destroy(media.public_id, {
      resource_type: resourceType
    });
    console.log(`Deleted Cloudinary asset ${media.public_id} (${resourceType}).`);

    // 4. Delete from MongoDB
    await media.deleteOne(); // Use deleteOne() on the found document instance
    console.log(`Deleted media document ${media._id} from MongoDB.`);

    res.json({
      message: 'Media asset deleted successfully.',
      referencesRemoved: galleryItemsRemoved // Or count of categories updated
    });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ message: 'Error deleting media asset.' });
  }
};

// GET storage usage (calculated from MongoDB)
exports.getUsage = async (req, res) => {
  try {
    const allMedia = await Media.find();
    const totalBytes = allMedia.reduce((acc, item) => acc + (item.size || 0), 0);
    res.json({ usedBytes: totalBytes });
  } catch (err) {
    console.error('Usage calculation error:', err);
    res.status(500).json({ message: 'Error calculating usage.' });
  }
};