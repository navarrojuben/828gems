const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  bookingType: {
    type: String,
    required: true,
    trim: true,
  },
  bookingName: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    trim: true,
  },
  numberOfGuests: {
    type: Number,
    min: 1,
  },
  specialRequest: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    default: 'Pending',
    trim: true,
  },
  note: {
    type: String,
    trim: true,
  },
  adminNotes: {
    type: String,
    trim: true,
  },
  images: {
    type: [String],
    default: [],
  },
  isFullyPaid: {
    type: Boolean,
    default: false,
  },
  currentBalance: {
    type: String,
    default: 0,
  },
  currentPaid: {
    type: Number,
    default: 0,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// 🔁 Auto-update isFullyPaid based on currentPaid vs currentBalance
bookingSchema.pre('save', function (next) {
  this.isFullyPaid = this.currentPaid >= this.currentBalance;
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
