const AmountSection = ({ formData, handleInputChange, handleAmountChange }) => {
  return (
    <>
      {/* Amount Fields */}
      <div className="mb-6 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg
            className="w-6 h-6 text-[#0077b6]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Amount Breakup
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pre-Tax Amount (₹) *
            </label>
            <input
              type="number"
              name="preTaxAmount"
              value={formData.preTaxAmount}
              onChange={(e) =>
                handleAmountChange("preTaxAmount", e.target.value)
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tax Amount (₹)
            </label>
            <input
              type="number"
              name="taxAmount"
              value={formData.taxAmount}
              onChange={(e) => handleAmountChange("taxAmount", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Total Amount (₹) *
            </label>
            <input
              type="number"
              name="postTaxAmount"
              value={formData.postTaxAmount}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-green-200 rounded-xl bg-green-50 font-bold text-green-700 text-lg"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Payment Date */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-[#0077b6]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Payment Date *
          </label>
          <input
            type="date"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleInputChange}
            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300 hover:border-[#0077b6]"
            required
          />
        </div>

        {/* Payment Mode */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-[#0077b6]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            Payment Mode *
          </label>
          <select
            name="paymentMode"
            value={formData.paymentMode}
            onChange={handleInputChange}
            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300 text-gray-700 font-medium hover:border-[#0077b6]"
            required
          >
            <option value="cash">💵 Cash</option>
            <option value="upi">📱 UPI</option>
            <option value="gpay">📱 GPay</option>
            <option value="paytm">📱 Paytm</option>
            <option value="card">💳 Card</option>
            <option value="bank_transfer">🏦 Bank Transfer</option>
            <option value="other">📝 Other</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default AmountSection;
