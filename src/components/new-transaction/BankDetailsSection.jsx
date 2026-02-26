const BankDetailsSection = ({
  formData,
  handleInputChange,
  userBankDetails,
}) => {
  return (
    <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-[#0077b6] animate-slideInUp">
      <h3 className="text-lg font-bold text-[#023e8a] mb-4 flex items-center gap-2">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        Bank/Payment Details
        {userBankDetails && (
          <span className="text-sm font-normal text-gray-600 ml-2">
            (Pre-filled from your profile)
          </span>
        )}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Transaction ID / Reference *
          </label>
          <input
            type="text"
            name="transactionId"
            value={formData.transactionId}
            onChange={handleInputChange}
            placeholder="Enter transaction/reference ID"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Account Number
          </label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleInputChange}
            placeholder={userBankDetails?.accountNumber || "Account number"}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
          />
        </div>
        {userBankDetails && (
          <>
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">
                Bank Name (from profile)
              </p>
              <p className="font-medium text-gray-800">
                {userBankDetails.bankName || "Not set"}
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">
                IFSC Code (from profile)
              </p>
              <p className="font-medium text-gray-800">
                {userBankDetails.ifscCode || "Not set"}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BankDetailsSection;
