const HeroSectionSlide = require("../models/HeroSectionSlide");

// GET all slides
exports.getAllSlides = async (req, res) => {
  try {
    const slides = await HeroSectionSlide.find().sort({ order: 1 });
    res.json(slides);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching slides." });
  }
};

// GET single slide by ID
exports.getSlideById = async (req, res) => {
  try {
    const slide = await HeroSectionSlide.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ message: "Slide not found." });
    }
    res.json(slide);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching slide." });
  }
};

// CREATE new slide
exports.createSlide = async (req, res) => {
  try {
    const data = req.body;

    // Ensure overlay defaults if missing
    data.overlay = {
      enabled: data.overlay?.enabled ?? true,
      color: data.overlay?.color || "black",
      opacity: data.overlay?.opacity ?? 0.3,
    };

    // Ensure button color default
    if (data.button) {
      data.button.color = data.button.color || "primary";
    }

    // 🔒 Prevent duplicate/mirror slide
    const existingSlide = await HeroSectionSlide.findOne({
      title: data.title,
      description: data.description,
      media: data.media,
      "button.text": data.button?.text || "",
      "button.url": data.button?.url || "",
      "button.color": data.button?.color || "primary",
      "overlay.enabled": data.overlay.enabled,
      "overlay.color": data.overlay.color,
      "overlay.opacity": data.overlay.opacity,
    });

    if (existingSlide) {
      const timeSinceCreated = Date.now() - new Date(existingSlide.createdAt).getTime();
      if (timeSinceCreated < 5000) {
        return res.status(429).json({
          message: "Duplicate slide just submitted. Please wait a few seconds.",
        });
      }

      return res.status(409).json({
        message: "A slide with identical content already exists.",
      });
    }

    const newSlide = await HeroSectionSlide.create(data);
    res.status(201).json(newSlide);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating slide." });
  }
};


// UPDATE slide
exports.updateSlide = async (req, res) => {
  try {
    const data = req.body;

    // Ensure overlay defaults if missing
    if (data.overlay) {
      data.overlay = {
        enabled: data.overlay.enabled ?? true,
        color: data.overlay.color || "black",
        opacity: data.overlay.opacity ?? 0.3
      };
    }

    // Ensure button color default
    if (data.button) {
      data.button.color = data.button.color || "primary";
    }

    const updatedSlide = await HeroSectionSlide.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    if (!updatedSlide) {
      return res.status(404).json({ message: "Slide not found." });
    }
    res.json(updatedSlide);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating slide." });
  }
};

// DELETE slide
exports.deleteSlide = async (req, res) => {
  try {
    const slide = await HeroSectionSlide.findByIdAndDelete(req.params.id);
    if (!slide) {
      return res.status(404).json({ message: "Slide not found." });
    }
    res.json({ message: "Slide deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting slide." });
  }
};

// REORDER slides
exports.reorderSlides = async (req, res) => {
  try {
    const { slides } = req.body;
    if (!Array.isArray(slides)) {
      return res.status(400).json({ message: "Slides array is required." });
    }

    const updatePromises = slides.map((slide) =>
      HeroSectionSlide.findByIdAndUpdate(slide._id, { order: slide.order })
    );

    await Promise.all(updatePromises);

    res.json({ message: "Slide order updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating slide order." });
  }
};
