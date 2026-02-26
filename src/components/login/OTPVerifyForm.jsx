import React from "react";

function OTPVerifyForm({
  handleVerifyOTP,
  handleRequestOTP,
  otp,
  setOtp,
  email,
  loading,
  countdown,
  setStep,
  setError,
  setSuccess,
}) {
  return (
    <form onSubmit={handleVerifyOTP} className="space-y-5">
      <div>
        <label className="block text-[#023e8a] font-semibold mb-2 text-sm">
          Enter 6-Digit OTP
        </label>
        <input
          type="text"
          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-center text-2xl tracking-widest font-mono font-bold text-[#023e8a]"
          placeholder="000000"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          maxLength={6}
          required
          disabled={loading}
          autoFocus
        />
        <p className="text-[#0077b6] text-xs mt-2 text-center">
          📧 OTP sent to {email}
        </p>
      </div>
      <button
        type="submit"
        disabled={loading || otp.length !== 6}
        className="w-full bg-gradient-to-r from-[#023e8a] to-[#0077b6] text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify & Login"}
      </button>
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => {
            setStep(1);
            setOtp("");
            setError("");
            setSuccess("");
          }}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Change Email
        </button>
        <button
          type="button"
          onClick={() => {
            setOtp("");
            handleRequestOTP({ preventDefault: () => {} });
          }}
          disabled={countdown > 0}
          className="text-[#0077b6] text-sm disabled:text-gray-400"
        >
          {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
        </button>
      </div>
    </form>
  );
}

export default OTPVerifyForm;
