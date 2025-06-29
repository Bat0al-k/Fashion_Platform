const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: String,
  customerEmail: String,
  amountTotal: Number,
  currency: String,
  status: String,
  cardLast4: String,
  cardBrand: String,
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      name: String,
      quantity: Number,
      unitPrice: Number,
      totalPrice: Number,
      
     
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Order', orderSchema);