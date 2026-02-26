const TransactionCard = ({
  transaction,
  index,
  user,
  formatDate,
  formatAmount,
  getStatusBadge,
  isPendingLike,
  setReviewTx,
  setRejectModal,
  setRejectComment,
  handleApprove,
}) => {
  return (
    <div
      key={transaction._id}
      style={{ animationDelay: `${index * 50}ms` }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-soft p-4 sm:p-6 hover:shadow-hover transition-all duration-300 card-hover animate-slideInRight border-l-4 border-transparent hover:border-[#0077b6]"
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
            <div className="flex items-center gap-2 bg-gradient-to-r from-[#023e8a]/10 to-[#0077b6]/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-[#0077b6] flex-shrink-0"
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
              <span className="font-bold text-[#023e8a] text-xs sm:text-sm truncate">
                {transaction.category?.name}
              </span>
            </div>
            <span
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm flex items-center gap-2 ${getStatusBadge(transaction.status)}`}
            >
              {transaction.status === "approved" && (
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {transaction.status === "pending" && (
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
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
              )}
              {transaction.status === "rejected" && (
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
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
              )}
              {(transaction.status || "pending").toUpperCase()}
            </span>
            {transaction.hasGSTInvoice && (
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-100 text-blue-700 flex items-center gap-2">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
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
                GST
              </span>
            )}
          </div>
          <p className="text-gray-800 font-semibold mb-2 text-base sm:text-lg">
            {transaction.purpose}
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 flex-shrink-0"
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
              <span className="truncate">{transaction.payeeClientName}</span>
            </span>
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 flex-shrink-0"
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
              {formatDate(
                transaction.paymentDate ||
                  transaction.transactionDate ||
                  transaction.createdAt,
              )}
            </span>
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 flex-shrink-0"
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
              {transaction.paymentMode || transaction.paymentMethod || "N/A"}
            </span>
          </div>
        </div>
        <div className="text-left sm:text-right lg:text-right">
          <p className="text-2xl sm:text-3xl font-bold text-[#023e8a]">
            ₹{formatAmount(transaction.postTaxAmount ?? transaction.amount)}
          </p>
          {Number(transaction.taxAmount) > 0 && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Tax: ₹{formatAmount(transaction.taxAmount)}
            </p>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-100 gap-3 sm:gap-4">
        <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
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
          <span className="truncate">
            Submitted by{" "}
            <span className="font-semibold">
              {transaction.submittedBy?.name}
            </span>{" "}
            on {formatDate(transaction.createdAt)}
          </span>
        </p>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-wrap">
          {/* Review button – always shown for admin */}
          {user?.role === "admin" && (
            <button
              onClick={() => setReviewTx(transaction)}
              className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 bg-[#0077b6] hover:bg-[#023e8a] text-white rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Review
            </button>
          )}
          {user?.role === "admin" && isPendingLike(transaction.status) && (
            <>
              <button
                onClick={() => {
                  setRejectModal({
                    open: true,
                    id: transaction._id,
                  });
                  setRejectComment("");
                }}
                className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Reject
              </button>
              <button
                onClick={() => handleApprove(transaction._id)}
                className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Approve
              </button>
            </>
          )}
        </div>
      </div>

      {/* Rejection Comment */}
      {transaction.status === "rejected" && transaction.adminComment && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl animate-slideInUp">
          <p className="text-sm font-bold text-red-700 mb-1 flex items-center gap-2">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Rejection Reason:
          </p>
          <p className="text-sm text-red-600">{transaction.adminComment}</p>
        </div>
      )}
    </div>
  );
};

export default TransactionCard;
