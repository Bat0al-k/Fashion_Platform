const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
dotenv.config();

const allowedOrigins = [
    'http://localhost:4200',
    'https://fashion-three-nu.vercel.app/',
];

module.exports = [
    express.json(),
    express.urlencoded(),
    cookieParser(),
    cors(
        {
        origin: function (origin, callback) {
            // allow requests with no origin 
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
            },
        credentials: true
        }
    ),
    morgan('dev'),
]
