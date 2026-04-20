// const express = require('express');
// const dotenv = require('dotenv');
// const bcrypt = require('bcrypt');
// const cors = require('cors');
// const morgan = require('morgan');
// const cookieParser = require('cookie-parser');
// dotenv.config();

// const allowedOrigins = [
//     'http://localhost:4200',
//     'https://fashion-three-nu.vercel.app',
// ];

// module.exports = [
//     cors({
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             console.log('❌ Blocked by CORS:', origin);
//             callback(new Error('Not allowed by CORS'));
//         }
//         },
//         credentials: true,
//     }),
//     express.json(),
//     express.urlencoded(),
//     cookieParser(),
//     morgan('dev'),
// ]




const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const allowedOrigins = [
  'http://localhost:4200',
  'https://fashion-three-nu.vercel.app',
];

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // السماح للطلبات اللي مفيهاش origin (زي Postman / server-to-server)
    if (!origin) return callback(null, true);

    // لو origin موجود في المسموح
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log('❌ Blocked by CORS:', origin);

    // مهم: منرجعش Error عشان مايكسرش request (زي OPTIONS)
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

module.exports = [
  cors(corsOptions),

  // مهم جدًا لحل preflight OPTIONS
  cors(corsOptions),
  express.json(),
  express.urlencoded({ extended: true }),
  cookieParser(),
  morgan('dev'),
];
