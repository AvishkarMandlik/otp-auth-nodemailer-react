require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const otpGenerator = require("otp-generator");

const app = express();
app.use(express.json());
app.use(cors());

let otpStore = {};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.post("/send-otp", async (req, res) => {
    const { email } = req.body;
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

    otpStore[email] = otp; // Store OTP temporarily

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "OTP sent successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error sending OTP" });
    }
});

app.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    if (otpStore[email] === otp) {
        delete otpStore[email]; // Remove OTP after successful verification
        res.json({ success: true, message: "OTP verified successfully!" });
    } else {
        res.status(400).json({ success: false, message: "Invalid OTP" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
