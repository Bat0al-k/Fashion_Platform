const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

dotenv.config();

const allowedOrigins = [
  "http://localhost:4200",
  "https://fashion-platform-so1s.vercel.app"
];

module.exports = [
  express.json(),
  express.urlencoded({ extended: true }),
  cookieParser(),
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
  morgan('dev'),
];
