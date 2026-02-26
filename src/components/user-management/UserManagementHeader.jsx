function UserManagementHeader({ openAddModal }) {
  return (
    <>
      {/* Header */}
      <div className="mb-8 animate-slideInUp">
        <div className="bg-gradient-to-r from-[#023e8a] to-[#0077b6] rounded-3xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                User Management
              </h1>
              <p className="text-blue-100 text-lg">
                Manage users, roles, and permissions
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="hidden md:flex items-center gap-2 bg-white text-[#0077b6] px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 shadow-lg"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New User
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Add Button */}
      <button
        onClick={openAddModal}
        className="md:hidden fixed bottom-6 right-6 bg-[#0077b6] text-white p-4 rounded-full shadow-2xl hover:bg-[#023e8a] transition-all duration-300 z-50"
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
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </>
  );
}

export default UserManagementHeader;
