const ReportDataDisplay = ({
  loading,
  reportData,
  reportType,
  user,
  formatCurrency,
}) => {
  return (
    <>
      {/* Report Display */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-soft p-16 text-center animate-fadeIn">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#0077b6] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">
            Generating report...
          </p>
          <p className="text-gray-400 text-sm mt-2">
            This may take a few moments
          </p>
        </div>
      )}

      {!loading && reportData && (
        <div className="bg-white rounded-2xl shadow-soft p-8 animate-slideInUp">
          {/* Category Breakdown */}
          {reportData.categoryBreakdown &&
            reportData.categoryBreakdown.length > 0 && (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-purple-600"
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
                  Category-wise Breakdown
                </h3>
                <div className="overflow-x-auto mb-8 rounded-xl border border-gray-200">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-[#023e8a] to-[#0077b6] text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide">
                          Category
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide">
                          Code
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wide">
                          Count
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wide">
                          Total Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.categoryBreakdown.map((cat, index) => (
                        <tr
                          key={index}
                          className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}
                        >
                          <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                            {cat.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                            {cat.code}
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-gray-800 font-semibold">
                            {cat.count}
                          </td>
                          <td className="px-6 py-4 text-sm text-right font-bold text-[#0077b6]">
                            {formatCurrency(cat.totalAmount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

          {/* Transaction Details Table - For Admin */}
          {user?.role === "admin" &&
            reportData.transactions &&
            reportData.transactions.length > 0 && (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 mt-8">
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Transaction Details
                </h3>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-[#023e8a] to-[#0077b6] text-white">
                      <tr>
                        <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wide">
                          Date
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wide">
                          User
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wide">
                          Category
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wide">
                          Purpose
                        </th>
                        <th className="px-4 py-4 text-right text-sm font-bold uppercase tracking-wide">
                          Amount
                        </th>
                        <th className="px-4 py-4 text-center text-sm font-bold uppercase tracking-wide">
                          Status
                        </th>
                        <th className="px-4 py-4 text-center text-sm font-bold uppercase tracking-wide">
                          Payment Mode
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.transactions.map((txn, index) => (
                        <tr
                          key={txn._id || index}
                          className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}
                        >
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {new Date(txn.transactionDate).toLocaleDateString(
                              "en-IN",
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">
                            {txn.submittedBy?.name ||
                              txn.payeeClientName ||
                              "N/A"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {txn.category?.name || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                            {txn.purpose || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-bold text-[#0077b6]">
                            {formatCurrency(txn.postTaxAmount || txn.amount)}
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                txn.status === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : txn.status === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {txn.status?.charAt(0).toUpperCase() +
                                txn.status?.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-gray-600 uppercase">
                            {txn.paymentMethod?.replace("_", " ") || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
        </div>
      )}

      {/* Category Report */}
      {reportType === "category" && (
        <>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <svg
              className="w-8 h-8 text-purple-600"
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
            Category-wise Analysis
          </h2>
          {Array.isArray(reportData) && reportData.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide">
                      Category
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wide">
                      Transactions
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wide">
                      Total Amount
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wide">
                      Average
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wide">
                      Min/Max
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((cat, index) => (
                    <tr
                      key={index}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-purple-50 transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-800">
                          {cat.name}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {cat.code}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-800 font-semibold">
                        {cat.count}
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-bold text-[#0077b6]">
                        {formatCurrency(cat.totalAmount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-600 font-medium">
                        {formatCurrency(cat.avgAmount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-600">
                        {formatCurrency(cat.minAmount)} /{" "}
                        {formatCurrency(cat.maxAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <svg
                className="w-20 h-20 text-gray-400 mx-auto mb-4"
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
              <p className="text-gray-600 text-lg font-semibold mb-2">
                No category data available
              </p>
              <p className="text-gray-500 text-sm">
                Try adjusting your filters or date range to see category-wise
                breakdown
              </p>
            </div>
          )}
        </>
      )}

      {/* Monthly Trend */}
      {reportType === "monthly" && reportData.months && (
        <>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
            Monthly Trend - {reportData.year}
          </h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide">
                    Month
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wide">
                    Transactions
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wide">
                    Total Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportData.months.map((month, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-green-50 transition-colors`}
                  >
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">
                      {month.month}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-800 font-semibold">
                      {month.count}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-[#0077b6]">
                      {formatCurrency(month.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && !reportData && (
        <div className="bg-white rounded-2xl shadow-soft p-16 text-center animate-fadeIn">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
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
          </div>
          <p className="text-gray-600 font-semibold text-lg mb-2">
            No Report Generated
          </p>
          <p className="text-gray-400">
            Select filters and click "Generate Report" to view data
          </p>
        </div>
      )}
    </>
  );
};

export default ReportDataDisplay;
