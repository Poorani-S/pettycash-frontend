const TransactionStatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft hover:shadow-hover transition-all duration-300 card-hover animate-slideInLeft border-l-4 border-blue-500">
        <div className="flex items-center justify-between mb-2">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500"
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
        </div>
        <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1">
          Total Transactions
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800">
          {stats.total}
        </p>
      </div>

      <div
        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft hover:shadow-hover transition-all duration-300 card-hover animate-slideInLeft border-l-4 border-yellow-500"
        style={{ animationDelay: "50ms" }}
      >
        <div className="flex items-center justify-between mb-2">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500"
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
        <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1">
          Pending
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800">
          {stats.pending}
        </p>
      </div>

      <div
        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft hover:shadow-hover transition-all duration-300 card-hover animate-slideInLeft border-l-4 border-green-500"
        style={{ animationDelay: "100ms" }}
      >
        <div className="flex items-center justify-between mb-2">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 text-green-500"
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
        <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1">
          Approved
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800">
          {stats.approved}
        </p>
      </div>

      <div
        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft hover:shadow-hover transition-all duration-300 card-hover animate-slideInLeft border-l-4 border-red-500"
        style={{ animationDelay: "150ms" }}
      >
        <div className="flex items-center justify-between mb-2">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1">
          Rejected
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800">
          {stats.rejected}
        </p>
      </div>

      <div
        className="bg-gradient-to-br from-[#023e8a] to-[#0077b6] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft hover:shadow-hover transition-all duration-300 card-hover animate-slideInLeft text-white border-l-4 border-white col-span-2 lg:col-span-1"
        style={{ animationDelay: "200ms" }}
      >
        <div className="flex items-center justify-between mb-2">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10"
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
        </div>
        <p className="text-blue-100 text-xs sm:text-sm font-semibold mb-1">
          Total Amount
        </p>
        <p className="text-2xl sm:text-3xl font-bold">
          ₹{stats.totalAmount.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default TransactionStatsCards;
