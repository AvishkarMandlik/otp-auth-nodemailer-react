import { useState } from "react";
import axios from "axios";

const OTPForm = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);

    const sendOtp = async () => {
        try {
            const response = await axios.post("http://localhost:5000/send-otp", { email });
            setMessage(response.data.message);
            setIsOtpSent(true);
        } catch (error) {
            setMessage("Error sending OTP");
        }
    };

    const verifyOtp = async () => {
        try {
            const response = await axios.post("http://localhost:5000/verify-otp", { email, otp });
            setMessage(response.data.message);
        } catch (error) {
            setMessage("Invalid OTP");
        }
    };

    return (
        <div>
            <h2>OTP Authentication</h2>
            <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button onClick={sendOtp}>Send OTP</button>

            {isOtpSent && (
                <>
                    <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                    <button onClick={verifyOtp}>Verify OTP</button>
                </>
            )}

            <p>{message}</p>
        </div>
    );
};

export default OTPForm;
