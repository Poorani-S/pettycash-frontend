import { toast } from "react-toastify";

const AddFundsModal = ({
  setShowAddFunds,
  selectedTransaction,
  setSelectedTransaction,
  sourceTransactionType,
  setSourceTransactionId,
  setSourceTransactionType,
  error,
  handleSubmit,
  selectedClient,
  setSelectedClient,
  handleClientChange,
  clients,
  selectedClientDetails,
  setSelectedClientDetails,
  setDeleteClientModal,
  transferType,
  setTransferType,
  currency,
  setCurrency,
  exchangeRate,
  setExchangeRate,
  amount,
  setAmount,
  purpose,
  setPurpose,
  transferDate,
  setTransferDate,
  bankName,
  setBankName,
  accountNumber,
  setAccountNumber,
  transactionId,
  setTransactionId,
  remarks,
  setRemarks,
  loading,
  userBankDetails,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowAddFunds(false);
      }}
    >
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideInUp">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
            <div className="bg-gradient-to-br from-[#023e8a] to-[#0077b6] text-white rounded-xl p-1.5 sm:p-2">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            Add Funds
          </h2>
          <button
            onClick={() => setShowAddFunds(false)}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all"
            title="Close Add Funds"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {selectedTransaction && (
          <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-xl flex items-start justify-between gap-3 animate-slideInRight">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-blue-800 font-semibold text-sm">
                  {sourceTransactionType === "expense"
                    ? "Converting expense to fund transfer"
                    : "Form populated from selected transaction"}
                </p>
                <p className="text-blue-600 text-xs mt-1">
                  {sourceTransactionType === "expense"
                    ? "⚠️ The original expense will be replaced with this fund transfer"
                    : "Review and modify the details below before submitting"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedTransaction(null);
                setSourceTransactionId(null);
                setSourceTransactionType(null);
                setAmount("");
                setCurrency("INR");
                setExchangeRate("1");
                setPurpose("");
                setRemarks("");
                setSelectedClient("");
                setSelectedClientDetails(null);
                setBankName(userBankDetails?.bankName || "");
                setAccountNumber("");
                setTransactionId("");
                toast.info("Form cleared");
              }}
              className="text-blue-500 hover:text-blue-700 transition-colors flex-shrink-0"
              title="Clear form"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 animate-slideInRight">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User/Client Selection */}
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Select User *
            </label>
            <div className="flex gap-2 items-center">
              <select
                value={selectedClient}
                onChange={handleClientChange}
                className="flex-1 px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300 font-medium hover:border-[#0077b6]"
                required
              >
                <option value="">-- Select User --</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name}{" "}
                    {client.bankDetails?.bankName
                      ? `(${client.bankDetails.bankName})`
                      : ""}
                  </option>
                ))}
                <option
                  value="add_new"
                  className="font-semibold text-[#0077b6]"
                >
                  ➕ Add New User
                </option>
              </select>

              {selectedClient && selectedClient !== "add_new" && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const client = clients.find(
                      (c) => c._id === selectedClient,
                    );
                    setDeleteClientModal({
                      show: true,
                      clientId: selectedClient,
                      clientName: client?.name || "",
                    });
                  }}
                  className="p-4 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl border-2 border-red-200 hover:border-red-300 transition-all"
                  title="Delete selected user"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Transfer Type */}
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              Payment Method *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTransferType("bank")}
                className={`py-4 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  transferType === "bank"
                    ? "bg-gradient-to-r from-[#023e8a] to-[#0077b6] text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                }`}
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
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Bank Transfer
              </button>
              <button
                type="button"
                onClick={() => setTransferType("cash")}
                className={`py-4 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  transferType === "cash"
                    ? "bg-gradient-to-r from-[#023e8a] to-[#0077b6] text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                }`}
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
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Cash
              </button>
            </div>
          </div>

          {/* Currency Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Currency *
            </label>
            <select
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value);
                if (e.target.value === "INR") {
                  setExchangeRate("1");
                } else {
                  // Set default exchange rates for common currencies if no rate set
                  if (!exchangeRate || exchangeRate === "1") {
                    const defaultRates = {
                      USD: "83.50",
                      EUR: "90.25",
                      GBP: "105.75",
                      AED: "22.75",
                      SGD: "62.40",
                      MYR: "18.90",
                    };
                    setExchangeRate(defaultRates[e.target.value] || "1");
                  }
                }
              }}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300 text-lg font-semibold hover:border-[#0077b6]"
              required
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="AED">AED (د.إ)</option>
              <option value="SGD">SGD (S$)</option>
              <option value="MYR">MYR (RM)</option>
            </select>
          </div>

          {/* Exchange Rate (only for non-INR) */}
          {currency !== "INR" && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Exchange Rate (to INR) *
              </label>
              <input
                type="number"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300 text-lg font-semibold hover:border-[#0077b6]"
                placeholder="Exchange rate to INR"
                required
                min="0.01"
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-2">
                1 {currency} = {exchangeRate || "0"} INR
                {currency !== "INR" && amount && exchangeRate && (
                  <span className="block text-[#0077b6] font-semibold mt-1">
                    {amount} {currency} = ₹
                    {(parseFloat(amount) * parseFloat(exchangeRate)).toFixed(2)}
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Amount */}
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Amount ({currency === "INR" ? "₹" : currency}) *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300 text-lg font-semibold hover:border-[#0077b6]"
              placeholder="0.00"
              required
              min="1"
              step="0.01"
            />
            {currency !== "INR" && amount && exchangeRate && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-[#0077b6] font-semibold">
                  💱 Conversion: {amount} {currency} = ₹
                  {(parseFloat(amount) * parseFloat(exchangeRate)).toFixed(2)}{" "}
                  INR
                </p>
              </div>
            )}
          </div>

          {/* Purpose/Need of Amount */}
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Purpose / Need of Amount *
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300 font-medium hover:border-[#0077b6]"
              placeholder="e.g., Tools, Office Supplies, Travel, etc."
              required
            />
          </div>

          {/* Transfer Date */}
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
              Transfer Date *
            </label>
            <input
              type="date"
              value={transferDate}
              onChange={(e) => setTransferDate(e.target.value)}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300 hover:border-[#0077b6]"
              required
            />
          </div>

          {/* Bank Transfer Fields */}
          {transferType === "bank" && (
            <div className="space-y-4 p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
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
                Bank Details
                {selectedClientDetails?.bankDetails && (
                  <span className="text-xs font-normal text-green-600 ml-2">
                    ✓ Auto-filled from selected user
                  </span>
                )}
              </h3>

              {/* Selected User's Bank Info (Read-only) */}
              {selectedClientDetails?.bankDetails ? (
                <div className="grid grid-cols-2 gap-3 p-4 bg-white rounded-lg border-2 border-green-200">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Bank Name</p>
                    <p className="font-semibold text-gray-800">
                      {selectedClientDetails.bankDetails.bankName || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Account Number</p>
                    <p className="font-semibold text-gray-800">
                      {selectedClientDetails.bankDetails.accountNumber ||
                        "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">IFSC Code</p>
                    <p className="font-semibold text-gray-800">
                      {selectedClientDetails.bankDetails.ifscCode || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Account Holder</p>
                    <p className="font-semibold text-gray-800">
                      {selectedClientDetails.bankDetails.accountHolderName ||
                        selectedClientDetails.name ||
                        "Not set"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-700 text-sm">
                    <p className="flex items-center gap-2">
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
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      {selectedClient
                        ? "Selected user has no bank details. Add bank details below or update their profile."
                        : "Please select a user to view bank details."}
                    </p>
                  </div>

                  {selectedClient && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
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
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Add Banking Details for Transfer
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Bank Name *
                          </label>
                          <input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="Enter bank name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Account Number *
                          </label>
                          <input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="Enter account number"
                            required
                          />
                        </div>
                      </div>
                      <p className="text-xs text-blue-600 mt-2">
                        💡 This information is for this transfer only and won't
                        update the user's profile.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Transaction ID / Reference *
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300 bg-white"
                  placeholder="Enter transaction ID or reference number"
                  required
                />
              </div>
            </div>
          )}

          {/* Remarks */}
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Remarks (Optional)
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300 hover:border-[#0077b6]"
              placeholder="Add any additional notes..."
              rows="3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#023e8a] to-[#0077b6] hover:from-[#0077b6] hover:to-[#00b4d8] text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding Funds...
              </>
            ) : (
              <>
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Funds
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFundsModal;
