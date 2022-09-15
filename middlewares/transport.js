const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true, // upgrade later with STARTTLS techonemx.com.
    auth: {
        user: "info@techonemx.com",
        pass: "#T3ch0n3mx..2022",
    }
});

module.exports = transporter;
