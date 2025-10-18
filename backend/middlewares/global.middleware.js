const express = require('express');
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
        origin: ["http://localhost:4200", "https://fashion-three-nu.vercel.app/"],  
        credentials: true
        }
    ),
    morgan('dev'),
]

