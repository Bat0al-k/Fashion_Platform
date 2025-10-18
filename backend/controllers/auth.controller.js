const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require('../models/user.model');
const generateVerificationToken = require('../utils/generate.verification.token');
const sendEmail = require('../utils/send.email');
const admin = require('../config/firebase');

const signUp = async (req, res) => {

    const { name, email, password} = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: "Email already exist" });

        const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUND) || 4);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,

            });

            //  to verification the mail when registered
        const verificationToken = generateVerificationToken(user._id);
        const verificationUrl = `${process.env.CLIENT_URL}/users/verify-email?token=${verificationToken}`;

        await sendEmail({
            to: email,
            subject: 'Verify your email',
            html: `<p>Hello ${name},</p>
                    <p>Click this link to verify your email: 
                    <a href="${verificationUrl}">Verify Email</a></p>`,
        });

        user.password = undefined;

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            msg: "User registered. Please check your email to verify your account.",
            token,
        });
        }catch (err) {
            console.error("Login Error:", err);
            res.status(500).json({ error: err.message || err });
        }

}

const logIn = async (req,res) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(400).json({msg: "Invalid user "})
        
        const match = await bcrypt.compare(password, user.password);
        if(!match) return res.status(400).json({msg: "Invalid match "})
            
        //  for verification .. 
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email first' });
        }
            
        const token = jwt.sign(
            {id: user.id , email: user.email}, 
            process.env.JWT_SECRET ,{expiresIn: "1d"}
        );       
        
        res.json({ token })
    }catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: err.message || err });
    }
}

    // verification email
const verifyEmail = async (req, res) => {
    const token = req.query.token;

    try {
        const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}verified=fail`);
        }

        user.isVerified = true;
        await user.save();
        return res.redirect(`${process.env.FRONTEND_URL}verified=success`);
    } catch (err) {
        return res.redirect(`${process.env.FRONTEND_URL}verified=fail`);
    }
};



    //  resend verify email
    const resendVerificationEmail = async (req, res) => {
        const { email } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
            return res.status(404).json({ message: "User not found" });
            }

            if (user.isVerified) {
            return res.status(400).json({ message: "Email is already verified" });
            }

            const verificationToken = generateVerificationToken(user._id);
            const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

            await sendEmail({
                to: email,
                subject: 'Resend Email Verification',
                html: `<p>Hello ${user.name},</p>
                        <p>Click this link to verify your email: 
                        <a href="${verificationUrl}">Verify Email</a></p>`,
            });

            res.status(200).json({ message: 'Verification email sent again' });

        } catch (err) {
            console.error("Resend Verification Error:", err);
            res.status(500).json({ error: err.message || err });
        }
    };

    //  Log in with google account 
    const loginWithGoogle = async (req, res) => {
    const { idToken } = req.body;
    try {

        
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name } = decodedToken;
        
        let user = await User.findOne({ email });
        if (!user) {
            
            user = await User.create({
                name: name || 'Google User',
                email,
                isVerified: true,
                googleId: uid, 
                password: null, 
            });
        }
        
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.status(200).json({
            msg: 'Login with Google successful',
            token,
            user: {
                name: user.name,
                email: user.email,
                id: user._id,
            }
        });
    } catch (err) {
        console.error("Google Login Error:", err);
        res.status(401).json({ msg: "Invalid Google token" });
    }
};

const logOut = (req, res) => {
        res.status(200).json({ msg: "Logged out successfully (client should remove token)" });
};

//  PROFILE --->  get user data
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        res.json({
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
        });
    } catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};

const updateProfile = async (req, res) => {
    const { name, currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id).select('+password');
        if (!user) return res.status(404).json({ msg: "User not found" });

        // Update name
        if (name) {
            user.name = name;
        }

        // Password change
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({ msg: "Current password is incorrect" });

            user.password = await bcrypt.hash(newPassword, Number(process.env.SALT_ROUND) || 4);
        }

        await user.save();

        res.json({ msg: "Profile updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};


module.exports = {
    signUp,
    logIn,
    logOut,
    verifyEmail,
    resendVerificationEmail,
    loginWithGoogle,
    getProfile,
    updateProfile
};
