const RejectReasonModal = ({
  rejectModal,
  setRejectModal,
  rejectComment,
  setRejectComment,
  handleReject,
}) => {
  if (!rejectModal.open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-red-500"
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
          Rejection Reason
        </h3>
        <textarea
          value={rejectComment}
          onChange={(e) => setRejectComment(e.target.value)}
          placeholder="Enter the reason for rejection (required)…"
          rows={4}
          className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none resize-none"
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => {
              setRejectModal({ open: false, id: null });
              setRejectComment("");
            }}
            className="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!rejectComment.trim()) {
                alert("Please enter a rejection reason.");
                return;
              }
              handleReject(rejectModal.id, rejectComment.trim());
            }}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all"
          >
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectReasonModal;
