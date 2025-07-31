const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// Public (Create booking)
router.post("/", bookingController.createBooking);

// Admin
router.get("/", bookingController.getAllBookings);
router.get("/:id", bookingController.getBookingById);
router.put("/:id", bookingController.updateBooking); // Full update
router.put("/:id/status", bookingController.updateBookingStatus); // Status-only update
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;
