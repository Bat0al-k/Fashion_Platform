const express = require('express');
// require {'dotenv'}.config();   // eng ali typing way..
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
dotenv.config();

module.exports = [
    express.json(),
    express.urlencoded(),
    cookieParser(),
    cors(
        {
        origin: "https://fashion-platform-so1s.vercel.app/",  "http://localhost:4200",
        credentials: true
        }
    ),
    morgan('dev'),
]

