import React from "react";

function PasswordLoginForm({
  handlePasswordLogin,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  loading,
  showOTPFallback,
  failedAttempts,
  switchToOTPMode,
}) {
  return (
    <form onSubmit={handlePasswordLogin} className="space-y-4 sm:space-y-5">
      <div>
        <label className="block text-[#023e8a] font-semibold mb-2 text-xs sm:text-sm">
          Email Address
        </label>
        <input
          type="email"
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] text-sm sm:text-base"
          placeholder="your.email@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div>
        <label className="block text-[#023e8a] font-semibold mb-2 text-xs sm:text-sm">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-11 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] text-sm sm:text-base"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  showPassword
                    ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                }
              />
            </svg>
          </button>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#023e8a] to-[#0077b6] text-white font-bold py-3 sm:py-3.5 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 text-sm sm:text-base"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      {showOTPFallback && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
          <p className="text-amber-800 text-xs sm:text-sm mb-3">
            ⚠️ You have {failedAttempts} failed login attempt(s). Admin has been
            notified.
          </p>
          <button
            type="button"
            onClick={switchToOTPMode}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-2.5 rounded-lg shadow hover:shadow-lg transition"
          >
            Switch to OTP Login
          </button>
        </div>
      )}

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={switchToOTPMode}
          className="text-[#0077b6] hover:text-[#023e8a] font-medium text-sm hover:underline"
        >
          Forgot Password? Login with OTP
        </button>
      </div>
    </form>
  );
}

export default PasswordLoginForm;
