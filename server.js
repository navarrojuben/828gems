const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware

app.use(express.json());
// CORS Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Test route
app.get('/', (req, res) => {
  res.send('Resort Booking Backend Running!');
});

// Auth Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Website Settings Routes
app.use('/api/settings', require('./routes/websiteSettingsRoutes'));
app.use('/api/media',    require('./routes/mediaRoutes'));

// Showcase Gallery Routes ✅
app.use('/api/showcasegallery', require('./routes/showcaseGalleryRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/about-contacts', require('./routes/aboutContactRoutes'));

app.use('/api/resortservices', require('./routes/resortServiceRoutes'));
app.use('/api/resortservicecategories', require('./routes/resortServiceCategoryRoutes'));
app.use("/api/resortschedules", require("./routes/resortScheduleRoutes"));

app.use("/api/bookings", require("./routes/bookingRoutes"));

app.use("/api/faqs", require("./routes/faqRoutes"));


app.use("/api/heroslides", require("./routes/heroSlidesRoutes"));

// You can add other admin routes here later, e.g.:
// app.use('/api/admin', require('./routes/adminRoutes'));

// Connect DB and start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
