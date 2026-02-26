import TransactionDetailPanel from "./TransactionDetailPanel";

const RecentTransactions = ({
  allTransactions,
  ftSearchQuery,
  setFtSearchQuery,
  selectedTransaction,
  setSelectedTransaction,
  handlePopulateFromTransaction,
  handleClearHistory,
  formatDateTime,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:gap-8">
      {/* Recent Transactions List */}
      <div className="bg-white rounded-2xl shadow-soft p-8 animate-slideInRight">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-2">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              Recent Transactions
            </h2>
            <p className="text-sm text-gray-500 mt-2 ml-14">
              💡 Click any transaction to populate the form above
            </p>
          </div>

          {allTransactions.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
              title="Clear all transaction history"
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

        {/* Search Bar */}
        {allTransactions.length > 0 && (
          <div className="relative mb-4">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by category, submitted by, fund transfer or expense..."
              value={ftSearchQuery}
              onChange={(e) => setFtSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300 text-sm"
            />
          </div>
        )}

        {/* Two-column layout for transactions and details */}
        <div className="flex gap-6">
          {/* Transactions List - Left Side */}
          <div
            className={`flex-1 ${selectedTransaction ? "max-w-xl" : "w-full"}`}
          >
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {allTransactions.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">
                    No transactions yet
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Your transactions will appear here
                  </p>
                </div>
              ) : (
                allTransactions
                  .filter((t) => {
                    if (!ftSearchQuery.trim()) return true;
                    const q = ftSearchQuery.toLowerCase();
                    const submitter =
                      t.addedBy?.name ||
                      t.initiatedBy?.name ||
                      t.submittedBy?.name ||
                      t.user?.name ||
                      "";
                    const category = t.category?.name || "";
                    const type =
                      t.transactionType === "fund_transfer"
                        ? "fund transfer"
                        : "expense";
                    const purpose = t.purpose || t.notes || "";
                    const recipient = t.recipientId?.name || "";
                    const description = t.description || "";
                    return (
                      submitter.toLowerCase().includes(q) ||
                      category.toLowerCase().includes(q) ||
                      type.includes(q) ||
                      purpose.toLowerCase().includes(q) ||
                      recipient.toLowerCase().includes(q) ||
                      description.toLowerCase().includes(q)
                    );
                  })
                  .map((transaction, index) => (
                    <div
                      key={transaction._id}
                      onClick={() => handlePopulateFromTransaction(transaction)}
                      className={`border-2 rounded-xl p-5 hover:shadow-lg transition-all duration-300 card-hover animate-slideInUp cursor-pointer ${
                        transaction.transactionType === "fund_transfer"
                          ? "border-green-100 hover:border-green-400"
                          : "border-red-100 hover:border-red-400"
                      } ${selectedTransaction?._id === transaction._id ? "ring-2 ring-blue-500 border-blue-400" : ""}`}
                      style={{ animationDelay: `${index * 50}ms` }}
                      title="Click to populate form with this transaction's details"
                    >
                      {/* Header: Type Badge, Description & Amount */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`rounded-full p-3 ${
                              transaction.transactionType === "fund_transfer"
                                ? "bg-gradient-to-br from-green-100 to-green-200"
                                : "bg-gradient-to-br from-red-100 to-red-200"
                            }`}
                          >
                            {transaction.transactionType === "fund_transfer" ? (
                              <svg
                                className="w-6 h-6 text-green-600"
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
                            ) : (
                              <svg
                                className="w-6 h-6 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M20 12H4"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-lg">
                              {transaction.transactionType === "fund_transfer"
                                ? transaction.recipientId?.name || "Fund Added"
                                : transaction.description ||
                                  transaction.category?.name ||
                                  "Expense"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDateTime(transaction.displayDate)}
                            </p>
                          </div>
                        </div>
                        <p
                          className={`text-2xl font-bold ${
                            transaction.transactionType === "fund_transfer"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.transactionType === "fund_transfer"
                            ? "+"
                            : "-"}
                          ₹
                          {(
                            transaction.displayAmount ||
                            transaction.postTaxAmount ||
                            transaction.preTaxAmount ||
                            transaction.amount ||
                            0
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* Transaction Type & Payment Method Badges */}
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold ${
                            transaction.transactionType === "fund_transfer"
                              ? "bg-gradient-to-r from-green-100 to-green-200 text-green-700"
                              : "bg-gradient-to-r from-red-100 to-red-200 text-red-700"
                          }`}
                        >
                          {transaction.transactionType === "fund_transfer"
                            ? "Fund Transfer"
                            : "Expense"}
                        </span>

                        {transaction.transactionType === "fund_transfer" && (
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold ${
                              transaction.transferType === "Bank Transfer" ||
                              transaction.transferType === "bank"
                                ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700"
                                : "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700"
                            }`}
                          >
                            {transaction.transferType === "Bank Transfer" ||
                            transaction.transferType === "bank"
                              ? "Bank Transfer"
                              : "Cash"}
                          </span>
                        )}

                        {transaction.transactionType === "expense" &&
                          transaction.category && (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700">
                              {transaction.category?.name || "Uncategorized"}
                            </span>
                          )}

                        {transaction.transactionType === "expense" &&
                          transaction.status && (
                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold ${
                                transaction.status === "approved" ||
                                transaction.status === "paid"
                                  ? "bg-gradient-to-r from-green-100 to-green-200 text-green-700"
                                  : transaction.status === "pending"
                                    ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700"
                                    : transaction.status === "rejected"
                                      ? "bg-gradient-to-r from-red-100 to-red-200 text-red-700"
                                      : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700"
                              }`}
                            >
                              {transaction.status.charAt(0).toUpperCase() +
                                transaction.status.slice(1)}
                            </span>
                          )}
                      </div>

                      {/* Purpose/Description */}
                      {(transaction.purpose || transaction.notes) && (
                        <div className="bg-purple-50 rounded-xl p-3 mb-3">
                          <div className="flex items-start gap-2">
                            <svg
                              className="w-5 h-5 text-purple-600 mt-0.5"
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
                            <div>
                              <span className="text-xs font-semibold text-purple-700 block">
                                {transaction.transactionType === "fund_transfer"
                                  ? "Purpose"
                                  : "Notes"}
                              </span>
                              <span className="text-sm text-purple-800">
                                {transaction.purpose || transaction.notes}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Bank Details for Bank Transfer */}
                      {transaction.transactionType === "fund_transfer" &&
                        (transaction.transferType === "Bank Transfer" ||
                          transaction.transferType === "bank") &&
                        (transaction.bankName ||
                          transaction.transactionReference) && (
                          <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700 space-y-1 mb-3">
                            {transaction.bankName && (
                              <p className="flex items-center gap-2">
                                <span className="font-semibold">Bank:</span>{" "}
                                {transaction.bankName}
                              </p>
                            )}
                            {transaction.transactionReference && (
                              <p className="flex items-center gap-2">
                                <span className="font-semibold">Txn ID:</span>{" "}
                                {transaction.transactionReference}
                              </p>
                            )}
                          </div>
                        )}

                      {/* Footer: Added By */}
                      <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                        <p className="text-xs text-gray-500">
                          {transaction.transactionType === "fund_transfer"
                            ? "Added"
                            : "Submitted"}{" "}
                          by:{" "}
                          <span className="font-medium text-gray-700">
                            {transaction.addedBy?.name ||
                              transaction.initiatedBy?.name ||
                              transaction.submittedBy?.name ||
                              transaction.user?.name ||
                              "Unknown"}
                          </span>
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDateTime(transaction.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Transaction Detail View - Right Side */}
          <TransactionDetailPanel
            selectedTransaction={selectedTransaction}
            setSelectedTransaction={setSelectedTransaction}
            formatDateTime={formatDateTime}
          />
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions;
