//  User Schema (`User.js`)

const mongoose = require('mongoose');
const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        // required: true,
        select: false
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    googleId: {
        type: String, // uid from Google
        default: null

    },
    dob: {
        type: Date ,
    }
},{timestamps: true});

const Account = mongoose.model('accounts', accountSchema);
module.exports = Account;
