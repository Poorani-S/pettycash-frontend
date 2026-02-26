const ReportConfirmModal = ({
  confirmModal,
  setConfirmModal,
  executeSendCEOReport,
}) => {
  if (!confirmModal.show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideInUp">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Confirm Action</h3>
        </div>
        <p className="text-gray-700 mb-6">{confirmModal.message}</p>
        <div className="flex gap-3">
          <button
            onClick={() =>
              setConfirmModal({ show: false, action: null, message: "" })
            }
            className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const { action } = confirmModal;
              setConfirmModal({ show: false, action: null, message: "" });
              if (action === "sendCEO") executeSendCEOReport();
            }}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportConfirmModal;
