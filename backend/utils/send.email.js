const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
    // Looking to send emails in production? Check out our Email API/SMTP product!
    try {
        const transporter = nodemailer.createTransport({
            //  service: 'gmail', 
            host: process.env.EMAIL_HOST,

            port: Number(process.env.EMAIL_PORT),
            // secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: `"E-Commerce Team" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log("📧 Email sent:", info.messageId);
    } catch (err) {
    console.error("❌ Error sending email:", err);
    throw new Error("Failed to send email");
    }
};

module.exports = sendEmail;
