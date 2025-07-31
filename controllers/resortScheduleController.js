const ResortSchedule = require("../models/ResortSchedule");

// Get all schedules
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await ResortSchedule.find().sort({ date: 1 });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single schedule by ID
exports.getScheduleById = async (req, res) => {
  try {
    const schedule = await ResortSchedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ error: "Schedule not found" });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new schedule
exports.createSchedule = async (req, res) => {
  try {
    const { title, date, time, description, image } = req.body;

    if (!title || !date || !time) {
      return res.status(400).json({ message: "Title, date, and time are required." });
    }

    // 🔒 Mirror request check
    const existing = await ResortSchedule.findOne({
      title,
      date,
      time,
      description: description || "",
      image: image || "",
    });

    if (existing) {
      const timeSinceCreated = Date.now() - new Date(existing.createdAt).getTime();
      if (timeSinceCreated < 5000) {
        return res.status(429).json({
          message: "Schedule just submitted. Please wait a few seconds.",
        });
      }

      return res.status(409).json({
        message: "Schedule with the same details already exists.",
      });
    }

    const newSchedule = new ResortSchedule(req.body);
    await newSchedule.save();
    res.status(201).json(newSchedule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Update a schedule
exports.updateSchedule = async (req, res) => {
  try {
    const updated = await ResortSchedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Schedule not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a schedule
exports.deleteSchedule = async (req, res) => {
  try {
    await ResortSchedule.findByIdAndDelete(req.params.id);
    res.json({ message: "Schedule deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
