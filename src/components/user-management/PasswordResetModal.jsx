function PasswordResetModal({
  selectedUserForPassword,
  generatedPassword,
  copyPasswordToClipboard,
  closePasswordModal,
}) {
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            🔐 New Password Generated
          </h3>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              User
            </label>
            <p className="text-gray-900 font-semibold">
              {selectedUserForPassword.name}
            </p>
            <p className="text-gray-500 text-sm">
              {selectedUserForPassword.email}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Temporary Password
            </label>
            <div className="flex gap-2">
              <div className="flex-1 px-4 py-3 bg-gray-100 rounded-lg border-2 border-gray-300 font-mono text-gray-900 break-all select-all">
                {generatedPassword}
              </div>
              <button
                onClick={copyPasswordToClipboard}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold flex items-center gap-2"
                title="Copy password to clipboard"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              <strong>ℹ️ Instructions:</strong>
            </p>
            <ul className="text-sm text-blue-900 ml-4 mt-2 space-y-1">
              <li>• Copy the password above</li>
              <li>• Share securely with the user</li>
              <li>• User should change it on first login</li>
              <li>• This password was hashed and cannot be viewed again</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={closePasswordModal}
            className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default PasswordResetModal;
