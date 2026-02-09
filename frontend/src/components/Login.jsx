// src/components/Login.jsx
import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";

const API = "https://although-subscriptions-varied-int.trycloudflare.com";
// const API = "http://localhost:8000";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const ALLOWED_EMAILS = [
    "srinivasu.attili@ltts.com",
    "manjunath.hs@ltts.com",
    "madhu.balan@ltts.com",
    "sagar.patil@ltts.com"
  ];

  const sendOtp = async () => {
    // 🔒 Email whitelist check
    if (!ALLOWED_EMAILS.includes(email.toLowerCase())) {
      alert("You are not authorized to access this application.");
      return;
    }
    try {
      await axios.post(`${API}/auth/send-otp`, new URLSearchParams({ email }));
      setStep(2);
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP. Check email.");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post(
        `${API}/auth/verify-otp`,
        new URLSearchParams({ email, otp })
      );

      // ✅ Pass BOTH token and email to App
      onLogin({ token: res.data.token, email: res.data.email });
      console.log("VERIFY OTP RESPONSE:", res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "OTP verification failed");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 6 }}>
      <Typography variant="h5" align="center">
        Login
      </Typography>

      <TextField
        fullWidth
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mt: 2 }}
        disabled={step === 2} // disable after sending OTP
      />

      {step === 2 && (
        <TextField
          fullWidth
          label="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          sx={{ mt: 2 }}
        />
      )}

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3 }}
        onClick={step === 1 ? sendOtp : verifyOtp}
      >
        {step === 1 ? "Send OTP" : "Verify OTP"}
      </Button>
    </Box>
  );
}
