// console.log('🔐 Stripe Key from .env:', process.env.STRIPE_SECRET_KEY);

// const express = require('express');
// const router = express.Router();
// const Stripe = require('stripe');


// require('dotenv').config();

// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;


// router.post('/', async (req, res) => {
//   try {
//     const products = req.body.products;

//     const line_items = products.map(product => ({
//       price_data: {
//         currency: 'usd',
//         product_data: {
//           name: product.name,
//         },
//         unit_amount: product.price * 100, // Stripe wants amount in cents
//       },
//       quantity: product.quantity,
//     }));

    

//     // const session = await stripe.checkout.sessions.create({
//     //   payment_method_types: ['card'],
//     //   mode: 'payment',
//     //   line_items,
//     //   success_url: 'https://example.com/success',
//     //   cancel_url: 'https://yourdomain.com/cancel',
//     // });

// const session = await stripe.checkout.sessions.create({
//   payment_method_types: ['card'],
//   mode: 'payment',
//   line_items,
//   metadata: {
//     products: JSON.stringify(products), 
//   },
//   success_url: 'http://localhost:4200/checkout/success',
//   cancel_url: 'https://yourdomain.com/cancel',
// });



//     res.json({ url: session.url });
//   } catch (error) {
//     console.error('Error creating checkout session:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;


console.log('🔐 Stripe Key from .env:', process.env.STRIPE_SECRET_KEY);

const express = require('express');
const router = express.Router();
const Stripe = require('stripe');


require('dotenv').config();
const verifyToken = require('../middlewares/auth.middleware');


const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;


router.post('/create-checkout-session',verifyToken, async (req, res) => {
  try {
     const rawProducts = req.body.products;

   const enrichedProducts = rawProducts.map(p => ({
  productId: p.productId || p._id,
  quantity: p.quantity,
  price: p.price,
  name:p.name,


}));



const line_items = enrichedProducts.map(p => ({    
    quantity: p.quantity,
      price_data: {
        currency   : 'usd',
        unit_amount: Math.round(p.price * 100),
        product_data: {
        name: p.name,
        metadata: { productId: p.productId ?? '' }
        }
      }
    }));


const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  mode: 'payment',
  line_items,
  metadata: {
    userId: req.user.id,
  products: JSON.stringify(enrichedProducts), 
  },
  success_url: 'http://localhost:4200/checkout/success',
  cancel_url: 'https://yourdomain.com/cancel',
});



    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;