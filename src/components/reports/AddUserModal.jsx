const AddUserModal = ({
  showAddUserModal,
  setShowAddUserModal,
  newClient,
  setNewClient,
  newUserLoading,
  handleAddNewUser,
}) => {
  if (!showAddUserModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideInUp">
        <div className="bg-gradient-to-r from-[#023e8a] to-[#0077b6] p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Create New User
            </h3>
            <button
              onClick={() => setShowAddUserModal(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg
                className="w-8 h-8"
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
        </div>

        <form onSubmit={handleAddNewUser} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={newClient.name}
                onChange={(e) =>
                  setNewClient({ ...newClient, name: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
                placeholder="Enter name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={newClient.email}
                onChange={(e) =>
                  setNewClient({ ...newClient, email: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={newClient.phone}
                onChange={(e) =>
                  setNewClient({ ...newClient, phone: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={newClient.category}
                onChange={(e) =>
                  setNewClient({ ...newClient, category: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
              >
                <option value="vendor">Vendor</option>
                <option value="supplier">Supplier</option>
                <option value="contractor">Contractor</option>
                <option value="service_provider">Service Provider</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Address
            </label>
            <textarea
              value={newClient.address}
              onChange={(e) =>
                setNewClient({ ...newClient, address: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
              placeholder="Enter address"
              rows="2"
            />
          </div>

          {/* Bank Details Section */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-[#0077b6]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Banking Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={newClient.bankDetails.bankName}
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      bankDetails: {
                        ...newClient.bankDetails,
                        bankName: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
                  placeholder="Enter bank name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={newClient.bankDetails.accountNumber}
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      bankDetails: {
                        ...newClient.bankDetails,
                        accountNumber: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
                  placeholder="Enter account number"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  IFSC Code
                </label>
                <input
                  type="text"
                  value={newClient.bankDetails.ifscCode}
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      bankDetails: {
                        ...newClient.bankDetails,
                        ifscCode: e.target.value.toUpperCase(),
                      },
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
                  placeholder="Enter IFSC code"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={newClient.bankDetails.accountHolderName}
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      bankDetails: {
                        ...newClient.bankDetails,
                        accountHolderName: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
                  placeholder="Enter account holder name"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setShowAddUserModal(false)}
              className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={newUserLoading}
              className="flex-1 bg-gradient-to-r from-[#023e8a] to-[#0077b6] hover:from-[#0077b6] hover:to-[#00b4d8] text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {newUserLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
