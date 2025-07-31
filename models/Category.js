const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String ,
      required: true,
      unique: true, // Ensures category names are unique
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    // This is the array that will contain references to Media documents
    media: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media', // Specifies that these IDs refer to documents in the 'Media' collection
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);