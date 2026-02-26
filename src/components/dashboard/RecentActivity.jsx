function RecentActivity({
  user,
  loading,
  recentTransactions,
  onClearAllData,
  onViewAll,
}) {
  return (
    <div
      className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-soft animate-slideInUp"
      style={{ animationDelay: "400ms" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 text-[#0077b6]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Recent Activity
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">
            Your latest transactions at a glance
          </p>
        </div>
        <div className="flex items-center gap-2">
          {user?.role === "admin" && (
            <button
              onClick={onClearAllData}
              className="px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg sm:rounded-xl transition-all duration-300 flex items-center gap-1 sm:gap-2 text-sm sm:text-base font-semibold"
            >
              <svg
                className="w-4 h-4"
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
              <span className="hidden sm:inline">Clear All</span>
            </button>
          )}
          <button
            onClick={onViewAll}
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-[#023e8a] to-[#0077b6] text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-1 sm:gap-2 group text-sm sm:text-base"
          >
            <span className="font-semibold hidden sm:inline">View All</span>
            <span className="font-semibold sm:hidden">All</span>
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-[#0077b6] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading transactions...</p>
        </div>
      ) : recentTransactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <p className="text-gray-600 font-semibold">No transactions yet</p>
          <p className="text-gray-500 text-sm mt-2">
            Start by submitting your first expense
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {recentTransactions.map((transaction, index) => (
            <div
              key={transaction._id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-[#0077b6] transition-all duration-300 animate-slideInRight gap-3 sm:gap-4"
            >
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                <div
                  className={`rounded-xl p-2 sm:p-3 ${
                    transaction.kind === "fund_transfer"
                      ? transaction.transferType === "bank"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                      : transaction.status === "approved"
                        ? "bg-green-100 text-green-600"
                        : transaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                  }`}
                >
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-sm sm:text-base truncate">
                    {transaction.description || "Expense"}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {transaction.kind === "fund_transfer"
                      ? `Fund Transfer (${transaction.transferType || ""})`
                      : transaction.category?.name || "General"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(
                      transaction.displayDate || transaction.transactionDate,
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                <p className="text-lg sm:text-xl font-bold text-gray-800">
                  ₹
                  {(
                    transaction.displayAmount ||
                    transaction.postTaxAmount ||
                    transaction.amount ||
                    0
                  ).toLocaleString()}
                </p>
                <span
                  className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${
                    transaction.kind === "fund_transfer"
                      ? transaction.transferType === "bank"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                      : transaction.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : transaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                  }`}
                >
                  {transaction.kind === "fund_transfer"
                    ? (transaction.transferType || "transfer").toUpperCase()
                    : transaction.status?.toUpperCase() || "PENDING"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentActivity;
