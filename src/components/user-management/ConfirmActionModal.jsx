function ConfirmActionModal({
  confirmModal,
  setConfirmModal,
  executeDeactivate,
  executeDelete,
  executeResendInvitation,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideInUp">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-yellow-600"
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
          </div>
          <h3 className="text-xl font-bold text-gray-900">Confirm Action</h3>
        </div>
        <p className="text-gray-700 mb-6">{confirmModal.message}</p>
        <div className="flex gap-3">
          <button
            onClick={() =>
              setConfirmModal({
                show: false,
                action: null,
                data: null,
                message: "",
              })
            }
            className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const { action, data } = confirmModal;
              setConfirmModal({
                show: false,
                action: null,
                data: null,
                message: "",
              });
              if (action === "deactivate")
                executeDeactivate(data.userId, data.userName);
              else if (action === "delete")
                executeDelete(data.userId, data.userName);
              else if (action === "resend")
                executeResendInvitation(
                  data.userId,
                  data.userName,
                  data.userEmail,
                );
            }}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmActionModal;
