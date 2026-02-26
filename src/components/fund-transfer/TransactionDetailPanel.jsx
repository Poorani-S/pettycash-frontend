const TransactionDetailPanel = ({
  selectedTransaction,
  setSelectedTransaction,
  formatDateTime,
}) => {
  if (!selectedTransaction) return null;

  return (
    <div className="w-96 border-l-2 border-gray-200 pl-6">
      <div className="sticky top-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            Transaction Details
          </h3>
          <button
            onClick={() => setSelectedTransaction(null)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Close details"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 space-y-4">
          {/* Transaction Type Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`px-4 py-2 rounded-lg font-bold text-sm ${
                selectedTransaction.transactionType === "fund_transfer"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {selectedTransaction.transactionType === "fund_transfer"
                ? "Fund Transfer"
                : "Expense"}
            </span>
            {selectedTransaction.status && (
              <span
                className={`px-3 py-1 rounded-lg font-semibold text-xs ${
                  selectedTransaction.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : selectedTransaction.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : selectedTransaction.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                }`}
              >
                {selectedTransaction.status}
              </span>
            )}
          </div>

          {/* Amount */}
          <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Amount</p>
            <p
              className={`text-3xl font-bold ${
                selectedTransaction.transactionType === "fund_transfer"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {selectedTransaction.transactionType === "fund_transfer"
                ? "+"
                : "-"}
              ₹
              {(
                selectedTransaction.displayAmount ||
                selectedTransaction.postTaxAmount ||
                selectedTransaction.amount ||
                0
              ).toLocaleString("en-IN")}
            </p>
          </div>

          {/* Transaction Info */}
          <div className="space-y-3">
            {selectedTransaction.transactionType === "fund_transfer" ? (
              <>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Transfer Type</p>
                  <p className="font-semibold text-gray-800">
                    {selectedTransaction.transferType === "bank" ||
                    selectedTransaction.transferType === "Bank Transfer"
                      ? "Bank Transfer"
                      : "Cash"}
                  </p>
                </div>

                {selectedTransaction.recipientId?.name && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Recipient</p>
                    <p className="font-semibold text-gray-800">
                      {selectedTransaction.recipientId.name}
                    </p>
                  </div>
                )}

                {(selectedTransaction.transferType === "bank" ||
                  selectedTransaction.transferType === "Bank Transfer") && (
                  <>
                    {selectedTransaction.bankName && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Bank Name</p>
                        <p className="font-semibold text-gray-800">
                          {selectedTransaction.bankName}
                        </p>
                      </div>
                    )}
                    {selectedTransaction.transactionReference && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Transaction Reference
                        </p>
                        <p className="font-mono text-sm text-gray-800">
                          {selectedTransaction.transactionReference}
                        </p>
                      </div>
                    )}
                  </>
                )}

                {(selectedTransaction.purpose || selectedTransaction.notes) && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Purpose</p>
                    <p className="text-gray-800">
                      {selectedTransaction.purpose || selectedTransaction.notes}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <p className="font-semibold text-gray-800">
                    {selectedTransaction.category?.name || "Uncategorized"}
                  </p>
                </div>

                {selectedTransaction.description && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Description</p>
                    <p className="text-gray-800">
                      {selectedTransaction.description}
                    </p>
                  </div>
                )}

                {selectedTransaction.purpose && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Purpose</p>
                    <p className="text-gray-800">
                      {selectedTransaction.purpose}
                    </p>
                  </div>
                )}

                {selectedTransaction.payeeClientName && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Payee</p>
                    <p className="font-semibold text-gray-800">
                      {selectedTransaction.payeeClientName}
                    </p>
                  </div>
                )}

                {selectedTransaction.paymentMethod && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                    <p className="font-semibold text-gray-800 capitalize">
                      {selectedTransaction.paymentMethod}
                    </p>
                  </div>
                )}

                {selectedTransaction.hasGSTInvoice && (
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-blue-600 font-semibold mb-1">
                      GST Details
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {selectedTransaction.preTaxAmount && (
                        <div>
                          <p className="text-xs text-gray-600">Pre-Tax</p>
                          <p className="font-semibold">
                            ₹
                            {selectedTransaction.preTaxAmount.toLocaleString(
                              "en-IN",
                            )}
                          </p>
                        </div>
                      )}
                      {selectedTransaction.taxAmount && (
                        <div>
                          <p className="text-xs text-gray-600">Tax</p>
                          <p className="font-semibold">
                            ₹
                            {selectedTransaction.taxAmount.toLocaleString(
                              "en-IN",
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="border-t border-gray-300 pt-3 mt-3">
              <p className="text-xs text-gray-500 mb-1">
                {selectedTransaction.transactionType === "fund_transfer"
                  ? "Added By"
                  : "Submitted By"}
              </p>
              <p className="font-semibold text-gray-800">
                {selectedTransaction.initiatedBy?.name ||
                  selectedTransaction.submittedBy?.name ||
                  selectedTransaction.requestedBy?.name ||
                  selectedTransaction.user?.name ||
                  "Unknown"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Date</p>
              <p className="text-gray-800">
                {formatDateTime(
                  selectedTransaction.displayDate ||
                    selectedTransaction.createdAt,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailPanel;
