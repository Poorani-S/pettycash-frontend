const FundTransferStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft hover:shadow-hover transition-all duration-300 border-l-4 border-purple-500 animate-slideInLeft card-hover">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide">
              Total Expense
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-[#023e8a] mt-1 sm:mt-2">
              ₹{stats.overall.total.toLocaleString("en-IN")}
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
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
              {stats.overall.count} transfers
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl sm:rounded-2xl p-3 sm:p-4">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600"
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
        </div>
      </div>
      {stats.byType.map((type, index) => (
        <div
          key={type._id}
          className={`bg-white rounded-2xl p-6 shadow-soft hover:shadow-hover transition-all duration-300 border-l-4 ${
            type._id === "Bank Transfer"
              ? "border-blue-500"
              : "border-green-500"
          } animate-slideInLeft card-hover`}
          style={{ animationDelay: `${(index + 1) * 100}ms` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">
                {type._id === "cash" || type._id === "Cash"
                  ? "Amount Spend"
                  : type._id}
              </p>
              <p className="text-3xl font-bold text-[#023e8a] mt-2">
                ₹{type.totalAmount.toLocaleString("en-IN")}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {type.count} transfers · Avg: ₹
                {Math.round(type.avgAmount).toLocaleString("en-IN")}
              </p>
            </div>
            <div
              className={`bg-gradient-to-br ${
                type._id === "Bank Transfer"
                  ? "from-blue-100 to-blue-200"
                  : "from-green-100 to-green-200"
              } rounded-2xl p-4`}
            >
              <svg
                className={`w-10 h-10 ${type._id === "Bank Transfer" ? "text-blue-600" : "text-green-600"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {type._id === "Bank Transfer" ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                )}
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FundTransferStats;
