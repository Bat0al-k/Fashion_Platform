const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const Order = require('../models/order.models');
const Account = require('../models/user.model');

require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post('/', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  console.log('Received webhook');
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }


  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;


    const products = JSON.parse(session.metadata.products);
    const sessionId = session.id;
    const amountTotal = session.amount_total;
    const currency = session.currency;
    const status = session.payment_status;
    const customerEmail = session.customer_details.email;
    const userId = session.metadata?.userId || null;


    try {

      const user = await Account.findById(userId);
if (!user) {
  console.log('❌ Invalid userId in metadata');
  return res.status(400).send('Invalid user');
}

      const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
      const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);

      const cardBrand = paymentMethod.card.brand;
      const cardLast4 = paymentMethod.card.last4;


      await Order.create({
        user: user._id,
        sessionId,
        customerEmail,
        amountTotal,
        currency,
        status,
        cardBrand,
        cardLast4,
       products: products.map(p => ({
        name: p.name || 'unnamed',
    productId: p.productId,
    quantity: p.quantity,
    unitPrice: p.price,
    totalPrice: p.price * p.quantity,
   
 }))
});

      console.log(' Order saved to DB');
    } catch (err) {
      console.error(' Error saving order:', err);
    }
  }
 //add
const cart = await Cart.find({ userId: session.client_reference_id });
console.log('🧾 User cart before deletion:', cart);
await Cart.deleteMany({ userId: session.client_reference_id });
  res.status(200).send(' Webhook received');
});

module.exports = router;
