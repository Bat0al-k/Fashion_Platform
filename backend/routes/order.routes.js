const express = require('express');
const router = express.Router();
const Order = require('../models/order.models');
const verifyToken = require('../middlewares/auth.middleware');
// router.get('/', async (req, res) => {
//   try {
//     const orders = await Order.find().sort({ createdAt: -1 });
//     res.status(200).json(orders);
//   } catch (err) {
//     console.error(' Error fetching orders:', err); 
//     res.status(500).json({ message: 'Error fetching orders', error: err.message });
//   }
// });

router.get("/",verifyToken,async (req, res) => {
  try {
    const userId = req.user.id; 
    const orders = await Order.find({ user: userId});
    console.log("Fetched Orders:", orders);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
});


module.exports = router;