function DashboardStatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {/* Total Expenses */}
      <div
        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft hover:shadow-hover transition-all duration-300 card-hover animate-slideInLeft border-l-4 border-blue-500"
        style={{ animationDelay: "100ms" }}
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="bg-gradient-to-br from-[#0077b6] to-[#00b4d8] rounded-xl p-2 sm:p-3">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span className="text-blue-500 text-xs sm:text-sm font-bold bg-blue-50 px-2 sm:px-3 py-1 rounded-full">
            Recent
          </span>
        </div>
        <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1">
          Total Expenses
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800">
          ₹{stats.totalExpenses.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500 mt-1 sm:mt-2">
          📊 Last 5 transactions
        </p>
      </div>

      {/* Pending Approval */}
      <div
        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft hover:shadow-hover transition-all duration-300 card-hover animate-slideInLeft border-l-4 border-yellow-500"
        style={{ animationDelay: "200ms" }}
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-2 sm:p-3">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 text-white"
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
          <span className="text-yellow-600 text-xs sm:text-sm font-bold bg-yellow-50 px-2 sm:px-3 py-1 rounded-full">
            Awaiting
          </span>
        </div>
        <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1">
          Pending Approval
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800">
          {stats.pendingCount}
        </p>
        <p className="text-xs text-gray-500 mt-1 sm:mt-2">⏳ Needs attention</p>
      </div>

      {/* Approved */}
      <div
        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft hover:shadow-hover transition-all duration-300 card-hover animate-slideInLeft border-l-4 border-purple-500"
        style={{ animationDelay: "300ms" }}
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-2 sm:p-3">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span className="text-purple-600 text-xs sm:text-sm font-bold bg-purple-50 px-2 sm:px-3 py-1 rounded-full">
            Success
          </span>
        </div>
        <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1">
          Approved Requests
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800">
          {stats.approvedCount}
        </p>
        <p className="text-xs text-gray-500 mt-1 sm:mt-2">✅ Completed</p>
      </div>
    </div>
  );
}

export default DashboardStatsCards;
