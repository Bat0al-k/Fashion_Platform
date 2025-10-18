const express = require('express');
const dotenv = require('dotenv');
const connectDB = require("./config/db");
const globalMiddleware = require('./middlewares/global.middleware');
const productRoutes = require('./routes/productRoutes');
const cloudinary = require('cloudinary').v2;
const bodyParser = require('body-parser');
const ordersRoutes = require('./routes/order.routes');
const checkoutRoutes = require('./routes/checkout');
const webhookRoutes = require('./routes/webhoockRouter');
const cors = require('cors');


dotenv.config();

const app = express();

app.use('/api/webhook', bodyParser.raw({ type: 'application/json' }));


// Connect to database
connectDB();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(express.json());


// Use global middlewares
globalMiddleware.forEach(middleware => app.use(middleware));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/checkout',  require('./routes/checkout'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/webhook', webhookRoutes);

// Additional routes without /api prefix for backward compatibility
app.use('/users', require('./routes/users.routes'));



// Test Route
app.get('/', (req, res) => {
  res.send('API is running..');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});