import axios from "../../utils/axios";
import { toast } from "react-toastify";

const ReportFilters = ({
  period,
  setPeriod,
  selectedCategory,
  setSelectedCategory,
  categories,
  fetchCategories,
  user,
  selectedUser,
  setSelectedUser,
  handleUserChange,
  users,
  usersLoading,
  lastUsersFetch,
  fetchUsers,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  selectedStatus,
  setSelectedStatus,
  children,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-8 mb-8 animate-slideInUp">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <div className="bg-gradient-to-br from-[#023e8a] to-[#0077b6] text-white rounded-xl p-2">
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
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </div>
        Report Filters
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Period */}
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Time Period
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300 font-medium hover:border-[#0077b6]"
          >
            <option value="all">🌐 All Time</option>
            <option value="today">📅 Today</option>
            <option value="week">🗓️ This Week</option>
            <option value="month">📆 This Month</option>
            <option value="quarter">🗂️ This Quarter</option>
            <option value="year">📋 This Year</option>
            <option value="custom">⚙️ Custom Range</option>
          </select>
        </div>

        {/* Category Filter */}
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
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            Category
          </label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300 font-medium hover:border-[#0077b6]"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {selectedCategory && (
              <button
                type="button"
                onClick={async () => {
                  if (
                    window.confirm(
                      `Delete category "${categories.find((c) => c._id === selectedCategory)?.name}"?\n\nThis will permanently remove this category.`,
                    )
                  ) {
                    try {
                      await axios.delete(`/categories/${selectedCategory}`);
                      toast.success("Category deleted successfully");
                      setSelectedCategory("");
                      fetchCategories();
                    } catch (error) {
                      toast.error(
                        error.response?.data?.message ||
                          "Failed to delete category",
                      );
                    }
                  }
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all"
                title="Delete category"
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
          </div>
        </div>

        {/* User Filter - Only for Admin */}
        {user?.role === "admin" && (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
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
                User
              </div>
              <div className="flex items-center gap-2">
                {lastUsersFetch && (
                  <span className="text-xs text-gray-500">
                    Last updated: {lastUsersFetch.toLocaleTimeString()}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => fetchUsers(true)}
                  disabled={usersLoading}
                  className="p-1 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
                  title="Refresh users list"
                >
                  <svg
                    className={`w-4 h-4 text-[#0077b6] ${usersLoading ? "animate-spin" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>
            </label>
            <div className="relative">
              <select
                value={selectedUser}
                onChange={handleUserChange}
                disabled={usersLoading}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300 font-medium hover:border-[#0077b6] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {usersLoading
                    ? "Loading users..."
                    : users.length > 0
                      ? `All Users (${users.length} total)`
                      : "All Users (No users found)"}
                </option>
                {!usersLoading && users.length > 0 ? (
                  users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.role || "N/A"})
                    </option>
                  ))
                ) : !usersLoading && users.length === 0 ? (
                  <option disabled>No users available</option>
                ) : null}
                {!usersLoading && (
                  <option
                    value="add_new"
                    className="font-semibold text-[#0077b6]"
                  >
                    ➕ Create New User
                  </option>
                )}
              </select>
              {selectedUser && selectedUser !== "add_new" && (
                <button
                  type="button"
                  onClick={async () => {
                    const userToDelete = users.find(
                      (u) => u._id === selectedUser,
                    );
                    if (
                      window.confirm(
                        `Delete user "${userToDelete?.name}"?\n\nThis will permanently remove this user from the system.`,
                      )
                    ) {
                      try {
                        await axios.delete(`/users/${selectedUser}`);
                        toast.success("User deleted successfully");
                        setSelectedUser("");
                        fetchUsers(true);
                      } catch (error) {
                        toast.error(
                          error.response?.data?.message ||
                            "Failed to delete user",
                        );
                      }
                    }
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete user"
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
            </div>
          </div>
        )}
      </div>

      {/* Custom Date Range */}
      {period === "custom" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-6 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 animate-slideInDown">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Start Date
            </label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              End Date
            </label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300"
            />
          </div>
        </div>
      )}

      {/* Status Filter */}
      <div className="mt-6">
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Status Filter
        </label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full md:w-1/3 px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300 font-medium hover:border-[#0077b6]"
        >
          <option value="">All Statuses</option>
          <option value="pending">⏳ Pending</option>
          <option value="approved">✅ Approved</option>
          <option value="rejected">❌ Rejected</option>
          <option value="paid">💰 Paid</option>
        </select>
      </div>

      {children}
    </div>
  );
};

export default ReportFilters;
