const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Register Admin
 * Recommend running only once or protecting via a secret key in .env
 */
exports.registerAdmin = async (req, res) => {
  try {
    const { username, password, secret } = req.body;

    if (secret !== process.env.REGISTER_SECRET) {
      return res.status(403).json({ message: "Forbidden: Invalid secret." });
    }

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      username,
      password: hashedPassword,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error." });
  }
};

/**
 * Login Admin
 */
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username === process.env.MASTER_ADMIN_USERNAME) {
      if (password === process.env.MASTER_ADMIN_PASSWORD) {
        const token = jwt.sign(
          { id: "master", isMaster: true },
          process.env.JWT_SECRET
          // ,{ expiresIn: "1d" }
        );
        return res.json({ token, master: true });
      } else {
        return res.status(400).json({ message: "Invalid credentials." });
      }
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET
      // ,{ expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error." });
  }
};

/**
 * Change Password
 */
exports.changePassword = async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;

    if (!username || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedNewPassword;

    await admin.save();

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error." });
  }
};

