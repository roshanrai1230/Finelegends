const dotenv = require('dotenv');
dotenv.config(); // Run dotenv config first before importing routes/controllers

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const contactRoutes = require('./routes/contactRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const settingRoutes = require('./routes/settingRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/categories', categoryRoutes);

const path = require('path');

// Serve static assets in production
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Wildcard fallback to serve index.html for React SPA client-side routes (like /admin)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in MVC structure on port ${PORT}`);
});
