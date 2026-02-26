import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PasswordLoginForm from "../components/login/PasswordLoginForm";
import OTPRequestForm from "../components/login/OTPRequestForm";
import OTPVerifyForm from "../components/login/OTPVerifyForm";

const API_URL = import.meta.env.VITE_API_URL || "/api";

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("password");
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showOTPFallback, setShowOTPFallback] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: email.trim(),
        password: password,
      });

      if (response.data.success) {
        setSuccess("Login successful! Redirecting...");
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data));
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (err) {
      const responseData = err.response?.data;
      const message =
        responseData?.message || "Login failed. Please try again.";

      // Check if 3 failed attempts reached
      if (responseData?.suggestOTP || responseData?.failedAttempts >= 3) {
        setShowOTPFallback(true);
        setFailedAttempts(responseData?.failedAttempts || 3);
        setError(message + " You can now use OTP login below.");
      } else {
        setError(message);
        setFailedAttempts(responseData?.failedAttempts || 0);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/request-otp`, {
        email: email.trim(),
      });
      if (response.data.success) {
        setSuccess(response.data.message);
        setStep(2);
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const switchToOTPMode = () => {
    setMode("otp");
    setStep(1);
    setError("");
    setSuccess("");
    setShowOTPFallback(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, {
        email: email.trim(),
        otp: otp.trim(),
      });
      if (response.data.success) {
        setSuccess("Login successful! Redirecting...");
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data));
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#023e8a] via-[#0077b6] to-[#00b4d8] flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-md relative z-10 animate-slideInUp">
        <div className="text-center mb-6 sm:mb-8">
          <img
            src="/kambaa-logo.png"
            alt="Logo"
            className="h-16 sm:h-20 w-auto mx-auto mb-3 sm:mb-4 drop-shadow-lg"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#023e8a] to-[#0077b6] bg-clip-text text-transparent mb-2">
            Petty Cash Management
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm">
            {mode === "password"
              ? "Sign in to your account"
              : step === 1
                ? "Reset via OTP"
                : "Enter OTP"}
          </p>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-700 text-xs sm:text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
            <p className="text-green-700 text-xs sm:text-sm">{success}</p>
          </div>
        )}

        {mode === "password" && (
          <PasswordLoginForm
            handlePasswordLogin={handlePasswordLogin}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            loading={loading}
            showOTPFallback={showOTPFallback}
            failedAttempts={failedAttempts}
            switchToOTPMode={switchToOTPMode}
          />
        )}

        {mode === "otp" && step === 1 && (
          <OTPRequestForm
            handleRequestOTP={handleRequestOTP}
            email={email}
            setEmail={setEmail}
            loading={loading}
            setMode={setMode}
            setError={setError}
            setSuccess={setSuccess}
            setShowOTPFallback={setShowOTPFallback}
            setFailedAttempts={setFailedAttempts}
          />
        )}

        {mode === "otp" && step === 2 && (
          <OTPVerifyForm
            handleVerifyOTP={handleVerifyOTP}
            handleRequestOTP={handleRequestOTP}
            otp={otp}
            setOtp={setOtp}
            email={email}
            loading={loading}
            countdown={countdown}
            setStep={setStep}
            setError={setError}
            setSuccess={setSuccess}
          />
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-xs">
            © 2026 Petty Cash Management System
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
