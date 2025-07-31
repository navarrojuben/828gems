const Faq = require("../models/Faq");

// GET all FAQs (optionally filtered by category)
exports.getAllFaqs = async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const faqs = await Faq.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single FAQ by ID
exports.getFaqById = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) return res.status(404).json({ error: "FAQ not found" });
    res.json(faq);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// CREATE a new FAQ (with duplicate prevention)
exports.createFaq = async (req, res) => {
  try {
    const { question, answer, category, order, isActive } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: "Question and answer are required." });
    }

    // ✅ Check for duplicate (mirror) FAQ
    const existingFaq = await Faq.findOne({
      question: { $regex: new RegExp(`^${question}$`, 'i') },
      answer: { $regex: new RegExp(`^${answer}$`, 'i') },
      category: category || null,
    });

    if (existingFaq) {
      const timeSinceCreated = Date.now() - new Date(existingFaq.createdAt).getTime();
      if (timeSinceCreated < 5000) {
        return res.status(429).json({
          message: "Duplicate FAQ just submitted. Please wait a few seconds.",
        });
      }

      return res.status(409).json({ message: "FAQ with the same content already exists." });
    }

    const newFaq = new Faq({ question, answer, category, order, isActive });
    await newFaq.save();
    res.status(201).json(newFaq);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE an FAQ
exports.updateFaq = async (req, res) => {
  try {
    const updated = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE an FAQ
exports.deleteFaq = async (req, res) => {
  try {
    await Faq.findByIdAndDelete(req.params.id);
    res.json({ message: "FAQ deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
