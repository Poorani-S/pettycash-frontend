// Build a URL to view an uploaded file from the stored path
const getFileUrl = (filePath) => {
  if (!filePath) return null;
  const normalized = filePath.replace(/\\/g, "/");
  const idx = normalized.indexOf("uploads/");
  if (idx === -1) return null;
  const base = (import.meta.env.VITE_API_URL || "/api").replace(/\/api$/, "");
  return `${base}/${normalized.substring(idx)}`;
};

// ── Small helper components ───────────────────────────────────────────────
const DetailRow = ({ label, value, span }) => (
  <div className={span ? "sm:col-span-2" : ""}>
    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
    <p className="font-semibold text-gray-800 text-sm">{value || "—"}</p>
  </div>
);

const DocumentCard = ({ label, filePath, onView }) => {
  const url = getFileUrl(filePath);
  const isPdf = filePath?.toLowerCase().endsWith(".pdf");

  return (
    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center gap-3 bg-gray-50">
      <p className="text-xs font-bold text-gray-600 self-start">{label}</p>
      {url ? (
        <>
          {isPdf ? (
            <div className="flex flex-col items-center gap-2">
              <svg
                className="w-12 h-12 text-red-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7H20.5v1.5z" />
              </svg>
              <span className="text-xs text-gray-500">PDF Document</span>
            </div>
          ) : (
            <img
              src={url}
              alt={label}
              className="w-full h-36 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity border border-gray-200"
              onClick={() => onView(url)}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
          <div className="flex gap-2 w-full">
            {!isPdf && (
              <button
                onClick={() => onView(url)}
                className="flex-1 py-2 text-xs font-semibold text-[#0077b6] bg-blue-50 hover:bg-blue-100 rounded-lg transition-all flex items-center justify-center gap-1"
              >
                <svg
                  className="w-3.5 h-3.5"
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
                Full View
              </button>
            )}
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all flex items-center justify-center gap-1"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download
            </a>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 py-4 text-gray-400">
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-xs">No file attached</p>
        </div>
      )}
    </div>
  );
};

const TransactionReviewModal = ({
  reviewTx,
  setReviewTx,
  formatDate,
  formatAmount,
  getStatusBadge,
  isPendingLike,
  setLightboxUrl,
  setRejectModal,
  setRejectComment,
  handleApprove,
}) => {
  if (!reviewTx) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) setReviewTx(null);
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#023e8a] to-[#0077b6] rounded-t-2xl">
          <div>
            <h2 className="text-white font-bold text-lg">Transaction Review</h2>
            <p className="text-blue-100 text-xs mt-0.5">
              {reviewTx.transactionNumber || reviewTx._id}
            </p>
          </div>
          <button
            onClick={() => setReviewTx(null)}
            className="text-white hover:text-blue-200 transition-colors"
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

        <div className="p-6 space-y-6">
          {/* Status badge */}
          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${getStatusBadge(reviewTx.status)}`}
            >
              {(reviewTx.status || "pending").toUpperCase()}
            </span>
            {reviewTx.hasGSTInvoice && (
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                GST Invoice
              </span>
            )}
          </div>

          {/* Submitter info */}
          <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap gap-4 text-sm">
            <div className="flex-1 min-w-32">
              <p className="text-gray-500 text-xs mb-1">Submitted by</p>
              <p className="font-semibold text-gray-800">
                {reviewTx.submittedBy?.name || "—"}
              </p>
              <p className="text-gray-500 text-xs">
                {reviewTx.submittedBy?.email}
              </p>
            </div>
            <div className="flex-1 min-w-32">
              <p className="text-gray-500 text-xs mb-1">Role</p>
              <p className="font-semibold text-gray-800 capitalize">
                {reviewTx.submittedBy?.role || "—"}
              </p>
            </div>
            <div className="flex-1 min-w-32">
              <p className="text-gray-500 text-xs mb-1">Submitted on</p>
              <p className="font-semibold text-gray-800">
                {formatDate(reviewTx.createdAt)}
              </p>
            </div>
          </div>

          {/* Core details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailRow
              label="Payee / Client"
              value={reviewTx.payeeClientName}
            />
            <DetailRow label="Category" value={reviewTx.category?.name} />
            <DetailRow label="Purpose" value={reviewTx.purpose} span />
            <DetailRow
              label="Payment Date"
              value={formatDate(reviewTx.paymentDate)}
            />
            <DetailRow
              label="Payment Mode"
              value={reviewTx.paymentMode || reviewTx.paymentMethod}
            />
            {reviewTx.transactionId && (
              <DetailRow
                label="Transaction / Ref ID"
                value={reviewTx.transactionId}
              />
            )}
            {reviewTx.invoiceDate && (
              <DetailRow
                label="Invoice Date"
                value={formatDate(reviewTx.invoiceDate)}
              />
            )}
          </div>

          {/* Amount breakdown */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="text-sm font-bold text-[#023e8a] mb-3">
              Amount Breakdown
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500 mb-1">Pre-Tax</p>
                <p className="text-lg font-bold text-gray-700">
                  ₹{formatAmount(reviewTx.preTaxAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Tax</p>
                <p className="text-lg font-bold text-gray-700">
                  ₹{formatAmount(reviewTx.taxAmount)}
                </p>
              </div>
              <div className="border-l-2 border-[#0077b6]">
                <p className="text-xs text-gray-500 mb-1">Total</p>
                <p className="text-2xl font-extrabold text-[#023e8a]">
                  ₹{formatAmount(reviewTx.postTaxAmount ?? reviewTx.amount)}
                </p>
              </div>
            </div>
          </div>

          {/* Documents section */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
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
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
              Attached Documents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DocumentCard
                label="Invoice / Bill"
                filePath={reviewTx.invoiceImage}
                onView={setLightboxUrl}
              />
              <DocumentCard
                label="Payment Proof"
                filePath={reviewTx.paymentProofImage}
                onView={setLightboxUrl}
              />
            </div>
          </div>

          {/* Rejection reason if already rejected */}
          {reviewTx.status === "rejected" && reviewTx.adminComment && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4">
              <p className="text-sm font-bold text-red-700 mb-1">
                Rejection Reason
              </p>
              <p className="text-sm text-red-600">{reviewTx.adminComment}</p>
            </div>
          )}

          {/* Action buttons (only for pending-like) */}
          {isPendingLike(reviewTx.status) && (
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setRejectModal({ open: true, id: reviewTx._id });
                  setRejectComment("");
                }}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Reject
              </button>
              <button
                onClick={() => handleApprove(reviewTx._id)}
                className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Approve
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionReviewModal;
