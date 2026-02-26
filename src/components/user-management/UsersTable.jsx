function UsersTable({
  users,
  loading,
  openAddModal,
  handleEdit,
  handleDeactivate,
  handleResetPassword,
  handleDeleteUser,
  handleResendInvitation,
  getRoleBadgeColor,
  getRoleIcon,
  passwordLoading,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-6">
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-[#0077b6] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
          <p className="text-gray-600 text-lg">No users found</p>
          <button
            onClick={openAddModal}
            className="mt-4 text-[#0077b6] font-semibold hover:underline"
          >
            Add your first user
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-bold text-gray-700">
                  User
                </th>
                <th className="text-left py-4 px-4 font-bold text-gray-700">
                  Employee
                </th>
                <th className="text-left py-4 px-4 font-bold text-gray-700">
                  Role
                </th>
                <th className="text-left py-4 px-4 font-bold text-gray-700">
                  Reports To
                </th>
                <th className="text-left py-4 px-4 font-bold text-gray-700">
                  Contact
                </th>
                <th className="text-left py-4 px-4 font-bold text-gray-700">
                  Created By
                </th>
                <th className="text-left py-4 px-4 font-bold text-gray-700">
                  Login Status
                </th>
                <th className="text-left py-4 px-4 font-bold text-gray-700">
                  Status
                </th>
                <th className="text-left py-4 px-4 font-bold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#0077b6] to-[#023e8a] rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {user.name}
                        </p>
                        {user.department && (
                          <p className="text-sm text-gray-500">
                            {user.department}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700 font-mono">
                      {user.employeeNumber || (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${getRoleBadgeColor(
                        user.role,
                      )}`}
                    >
                      {getRoleIcon(user.role)}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {user.managerId ? (
                      <div className="text-sm">
                        <p className="font-medium text-gray-700">
                          {user.managerId.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user.managerId.email}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">
                        {user.role === "admin" || user.role === "manager"
                          ? "CEO"
                          : "—"}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-700">{user.email}</p>
                    <p className="text-sm text-gray-500">{user.phone}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      {user.createdBy ? (
                        <div>
                          <p className="font-medium text-gray-700">
                            {user.createdBy.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user.createdBy.email}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-400">System</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {user.lastLogin ? (
                      <div className="text-sm">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold mb-1">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          Logged In
                        </span>
                        <p className="text-xs text-gray-500">
                          {new Date(user.lastLogin).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                        Never
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                        <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-[#0077b6] hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      {user.isActive && (
                        <button
                          onClick={() => handleDeactivate(user._id, user.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Deactivate"
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
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                            />
                          </svg>
                        </button>
                      )}
                      {user.isActive && (
                        <button
                          onClick={() =>
                            handleResetPassword(user._id, user.name)
                          }
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Reset/Regenerate Password"
                          disabled={passwordLoading}
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
                              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.97 5.95m-2.02-2.02a7 7 0 10-9.92-9.92m9.92 9.92L21 21"
                            />
                          </svg>
                        </button>
                      )}
                      {user.isActive && (
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to permanently delete user "${user.name}"? This action cannot be undone.`,
                              )
                            ) {
                              handleDeleteUser(user._id, user.name);
                            }
                          }}
                          className="p-2 text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete User Permanently"
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
                        </button>
                      )}
                      {user.isActive && (
                        <button
                          onClick={() =>
                            handleResendInvitation(
                              user._id,
                              user.name,
                              user.email,
                            )
                          }
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Resend Invitation Email"
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
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UsersTable;
