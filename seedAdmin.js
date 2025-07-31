// seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

(async () => {
  await mongoose.connect('mongodb://localhost:27017/YOUR_DB_NAME');

  const hashedPassword = await bcrypt.hash('admin080722', 10);

  const admin = new Admin({
    username: 'lapensaradmin',
    password: hashedPassword
  });

  await admin.save();

  console.log('Admin user created!');
  process.exit();
})();
