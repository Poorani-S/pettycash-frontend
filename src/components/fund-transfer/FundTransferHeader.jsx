const FundTransferHeader = () => {
  return (
    <div className="bg-gradient-to-r from-[#023e8a] via-[#0077b6] to-[#00b4d8] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 text-white shadow-xl animate-fadeIn">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
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
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">
            Fund Transfer Management
          </h1>
          <p className="text-white/90 text-xs sm:text-sm">
            Add funds to petty cash via Bank Transfer or Cash Disbursement
          </p>
        </div>
      </div>
    </div>
  );
};

export default FundTransferHeader;
