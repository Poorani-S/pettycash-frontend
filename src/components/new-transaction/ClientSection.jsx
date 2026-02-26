const ClientSection = ({
  formData,
  handleInputChange,
  handleClientSelect,
  clients,
  setDeleteConfirm,
  showAddClient,
  setShowAddClient,
  newClient,
  setNewClient,
  handleAddClient,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Invoice Date */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Invoice Date *
          </label>
          <input
            type="date"
            name="invoiceDate"
            value={formData.invoiceDate}
            onChange={handleInputChange}
            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300 hover:border-[#0077b6]"
            required
          />
        </div>

        {/* Payee/Client Name */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Payee/Client *
          </label>
          <select
            name="clientId"
            value={formData.clientId}
            onChange={(e) => handleClientSelect(e.target.value)}
            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300 hover:border-[#0077b6]"
            required
          >
            <option value="">Select Client/Payee</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name} {client.gstNumber ? `(${client.gstNumber})` : ""}
              </option>
            ))}
            <option value="add_new">➕ Add New Client</option>
          </select>

          {formData.clientId && formData.clientId !== "add_new" && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const client = clients.find((c) => c._id === formData.clientId);
                setDeleteConfirm({
                  show: true,
                  clientId: formData.clientId,
                  clientName: client?.name || "",
                });
              }}
              className="mt-3 w-full px-4 py-3 bg-red-500 text-white hover:bg-red-600 rounded-xl transition-all font-bold flex items-center justify-center gap-2"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete Selected Client
            </button>
          )}
        </div>
      </div>

      {/* Add New Client Modal */}
      {showAddClient && (
        <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-[#0077b6] animate-slideInUp">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#023e8a] flex items-center gap-2">
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Add New Client
            </h3>
            <button
              type="button"
              onClick={() => setShowAddClient(false)}
              className="text-gray-500 hover:text-gray-700"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Client Name *"
              value={newClient.name}
              onChange={(e) =>
                setNewClient({ ...newClient, name: e.target.value })
              }
              className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6]"
              required
            />
            <input
              type="text"
              placeholder="GST Number (Optional)"
              value={newClient.gstNumber}
              onChange={(e) =>
                setNewClient({
                  ...newClient,
                  gstNumber: e.target.value.toUpperCase(),
                })
              }
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6]"
            />
            <input
              type="email"
              placeholder="Email (Optional)"
              value={newClient.email}
              onChange={(e) =>
                setNewClient({ ...newClient, email: e.target.value })
              }
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6]"
            />
            <input
              type="text"
              placeholder="Phone (Optional)"
              value={newClient.phone}
              onChange={(e) =>
                setNewClient({ ...newClient, phone: e.target.value })
              }
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6]"
            />
            <input
              type="text"
              placeholder="What they supply (Optional)"
              value={newClient.supplyType}
              onChange={(e) =>
                setNewClient({ ...newClient, supplyType: e.target.value })
              }
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6]"
            />
            <select
              value={newClient.category}
              onChange={(e) =>
                setNewClient({ ...newClient, category: e.target.value })
              }
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6]"
            >
              <option value="vendor">Vendor</option>
              <option value="supplier">Supplier</option>
              <option value="contractor">Contractor</option>
              <option value="service_provider">Service Provider</option>
              <option value="other">Other</option>
            </select>
          </div>
          <textarea
            placeholder="Address (Optional)"
            value={newClient.address}
            onChange={(e) =>
              setNewClient({ ...newClient, address: e.target.value })
            }
            className="w-full mt-4 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6]"
            rows="2"
          />
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={handleAddClient}
              className="flex-1 bg-gradient-to-r from-[#023e8a] to-[#0077b6] text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all"
            >
              Save Client
            </button>
            <button
              type="button"
              onClick={() => setShowAddClient(false)}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientSection;
