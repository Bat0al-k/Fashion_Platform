const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
dotenv.config();

const allowedOrigins = [
    'http://localhost:4200',
    'https://fashion-three-nu.vercel.app',
];

module.exports = [
    cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('❌ Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
        },
        credentials: true,
    }),
    express.json(),
    express.urlencoded(),
    cookieParser(),
    morgan('dev'),
]
