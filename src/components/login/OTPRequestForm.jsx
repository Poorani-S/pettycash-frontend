import React from "react";

function OTPRequestForm({
  handleRequestOTP,
  email,
  setEmail,
  loading,
  setMode,
  setError,
  setSuccess,
  setShowOTPFallback,
  setFailedAttempts,
}) {
  return (
    <form onSubmit={handleRequestOTP} className="space-y-5">
      <div>
        <label className="block text-[#023e8a] font-semibold mb-2 text-sm">
          Email Address
        </label>
        <input
          type="email"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6]"
          placeholder="your.email@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#023e8a] to-[#0077b6] text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50"
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => {
            setMode("password");
            setError("");
            setSuccess("");
            setShowOTPFallback(false);
            setFailedAttempts(0);
          }}
          className="text-[#0077b6] hover:text-[#023e8a] font-medium text-sm hover:underline"
        >
          ← Back to Password Login
        </button>
      </div>
    </form>
  );
}

export default OTPRequestForm;
