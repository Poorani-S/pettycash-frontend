const SummaryStatsCards = ({
  summaryStats,
  fundTransferSummary,
  formatCurrency,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-8 animate-slideInUp mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <svg
          className="w-8 h-8 text-[#0077b6]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Summary Report
      </h2>

      {/* Summary Cards - Combined Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-[#0077b6] shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide mb-2">
            Total Expenses
          </p>
          <p className="text-4xl font-bold text-[#023e8a]">
            {(summaryStats.totalTransactions || 0) +
              (fundTransferSummary.overall.count || 0)}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {formatCurrency(
              (summaryStats.totalAmount || 0) +
                (fundTransferSummary.overall.total || 0),
            )}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-l-4 border-green-500 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide mb-2">
            Approved
          </p>
          <p className="text-4xl font-bold text-green-700">
            {(summaryStats.approvedCount || 0) +
              (fundTransferSummary.overall.count || 0)}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {formatCurrency(
              (summaryStats.approvedAmount || 0) +
                (fundTransferSummary.overall.total || 0),
            )}
          </p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border-l-4 border-yellow-500 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide mb-2">
            Pending
          </p>
          <p className="text-4xl font-bold text-yellow-700">
            {summaryStats.pendingCount || 0}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {formatCurrency(summaryStats.pendingAmount || 0)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border-l-4 border-red-500 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide mb-2">
            Rejected
          </p>
          <p className="text-4xl font-bold text-red-700">
            {summaryStats.rejectedCount || 0}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {formatCurrency(summaryStats.rejectedAmount || 0)}
          </p>
        </div>
      </div>

      {/* Fund Transfer Summary - Additional Info */}
      {fundTransferSummary.overall.count > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-l-4 border-green-500 shadow-sm">
            <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide mb-2">
              Bank Transfers
            </p>
            <p className="text-4xl font-bold text-green-700">
              {formatCurrency(fundTransferSummary.bank.totalAmount)}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {fundTransferSummary.bank.count} transfer(s)
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border-l-4 border-yellow-500 shadow-sm">
            <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide mb-2">
              Cash Transfers
            </p>
            <p className="text-4xl font-bold text-yellow-700">
              {formatCurrency(fundTransferSummary.cash.totalAmount)}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {fundTransferSummary.cash.count} transfer(s)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryStatsCards;
