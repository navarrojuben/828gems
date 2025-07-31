const Booking = require('../models/Booking');

/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @access  Public
 */
exports.createBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      bookingType,
      bookingName,
      date,
      timeSlot,
      numberOfGuests,
      specialRequest,
      currentBalance,
      currentPaid,
    } = req.body;

    // Basic required field validation
    if (!name || !bookingType || !bookingName || !date) {
      return res.status(400).json({
        message: "Name, booking type, booking name, and date are required.",
      });
    }

    // Ensure balance/paid are non-negative numbers
    if ((currentBalance || 0) < 0 || (currentPaid || 0) < 0) {
      return res.status(400).json({
        message: "Balance and Paid amounts cannot be negative.",
      });
    }

    // Check for possible duplicate
    const duplicate = await Booking.findOne({
      name,
      email,
      phone,
      bookingType,
      bookingName,
      date,
      timeSlot,
      numberOfGuests,
      specialRequest,
      isDeleted: false,
    });

    if (duplicate) {
      const timeSinceLast = Date.now() - new Date(duplicate.createdAt).getTime();
      if (timeSinceLast < 5000) {
        return res.status(429).json({
          message: "Duplicate booking just submitted. Please wait a few seconds.",
        });
      }

      return res.status(409).json({
        message: "Duplicate booking found. Please avoid submitting the same request.",
      });
    }

    const booking = new Booking({ ...req.body });
    const savedBooking = await booking.save();

    res.status(201).json({
      message: "Booking created successfully.",
      booking: savedBooking,
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: "Server error during booking creation." });
  }
};

/**
 * @desc    Get all bookings (non-deleted)
 * @route   GET /api/bookings
 * @access  Public
 */
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    console.error('Error fetching all bookings:', err);
    res.status(500).json({ error: "Server error during fetching bookings." });
  }
};

/**
 * @desc    Get a single booking by ID
 * @route   GET /api/bookings/:id
 * @access  Public
 */
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.isDeleted) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    res.status(200).json(booking);
  } catch (err) {
    console.error(`Error fetching booking by ID ${req.params.id}:`, err);
    res.status(400).json({ message: 'Invalid booking ID format.' });
  }
};

/**
 * @desc    Update booking status only
 * @route   PUT /api/bookings/:id/status
 * @access  Public
 */
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required for update." });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    res.status(200).json({
      message: "Booking status updated successfully.",
      booking,
    });
  } catch (err) {
    console.error(`Error updating booking status:`, err);
    res.status(500).json({ error: "Server error during status update." });
  }
};

/**
 * @desc    Full update of an existing booking
 * @route   PUT /api/bookings/:id
 * @access  Public
 */
exports.updateBooking = async (req, res) => {
  try {
    const {
      currentBalance,
      currentPaid,
    } = req.body;

    if ((currentBalance || 0) < 0 || (currentPaid || 0) < 0) {
      return res.status(400).json({ message: "Balance and Paid amounts cannot be negative." });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    res.status(200).json({
      message: "Booking updated successfully.",
      booking,
    });
  } catch (err) {
    console.error(`Error updating booking ${req.params.id}:`, err);
    res.status(500).json({ error: "Server error during booking update." });
  }
};

/**
 * @desc    Soft delete a booking
 * @route   DELETE /api/bookings/:id
 * @access  Public
 */
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { isDeleted: true });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    res.status(200).json({ message: 'Booking deleted successfully.' });
  } catch (err) {
    console.error(`Error soft-deleting booking ${req.params.id}:`, err);
    res.status(500).json({ error: "Server error during booking deletion." });
  }
};
