const Order = require('../models/order.models');

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error getting orders' });
  }
};

module.exports = {
  getUserOrders,
};