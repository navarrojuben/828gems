const ResortService = require("../models/ResortService");

// GET all services (optionally filtered by category)
exports.getAllServices = async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const services = await ResortService.find(filter).sort({ title: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE new service (with duplicate protection)
exports.createService = async (req, res) => {
  try {
    const {
      title,
      price,
      moreInfo,
      inclusions,
      images,
      category,
      quantity = 1,
      stocks = 0,
    } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({ message: "Title and price are required." });
    }

    // 🔒 Mirror check for identical existing service
    const existing = await ResortService.findOne({
      title,
      price,
      moreInfo: moreInfo || "",
      inclusions: inclusions || [],
      images: images || [],
      category: category || "",
      quantity,
      stocks,
    });

    if (existing) {
      const timeSinceCreated = Date.now() - new Date(existing.createdAt).getTime();
      if (timeSinceCreated < 5000) {
        return res.status(429).json({ message: "Duplicate service just submitted. Please wait." });
      }

      return res.status(409).json({
        message: "Service with identical details already exists.",
      });
    }

    const newService = new ResortService({
      title,
      price,
      moreInfo,
      inclusions,
      images,
      category,
      quantity,
      stocks,
    });

    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// UPDATE a service
exports.updateService = async (req, res) => {
  try {
    const updated = await ResortService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE a service
exports.deleteService = async (req, res) => {
  try {
    await ResortService.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
