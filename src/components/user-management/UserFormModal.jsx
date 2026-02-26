import axios from "../../utils/axios";
import { toast } from "react-toastify";

function UserFormModal({
  editingUser,
  formData,
  handleInputChange,
  handleSubmit,
  setShowAddModal,
  setEditingUser,
  setFormData,
  users,
  fetchUsers,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-[#023e8a] to-[#0077b6] p-6 text-white rounded-t-2xl">
          <h2 className="text-2xl font-bold">
            {editingUser ? "Edit User" : "Add New User"}
          </h2>
          <p className="text-blue-100 mt-1">
            {editingUser
              ? "Update user information"
              : "Create a new user account with invitation"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
                required
                disabled={editingUser !== null}
              />
              {!editingUser && (
                <p className="text-sm text-gray-500 mt-1">
                  Invitation email will be sent to this address
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
                required
              />
            </div>

            {/* Password - Optional */}
            {!editingUser && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Password (Optional)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
                  placeholder="Leave empty to allow OTP-only login"
                  minLength={6}
                />
                <p className="text-sm text-gray-500 mt-1">
                  If provided, user can login with password or OTP. If not
                  provided, user can only login with OTP.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Role */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
                  required
                >
                  <option value="admin">👑 Admin</option>
                  <option value="manager">📋 Manager</option>
                  <option value="employee">👤 Employee</option>
                  <option value="intern">🎓 Intern</option>
                </select>
              </div>

              {/* Manager Assignment - For employees and interns */}
              {(formData.role === "employee" || formData.role === "intern") && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Assign Manager *
                  </label>
                  <div className="relative">
                    <select
                      name="managerId"
                      value={formData.managerId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
                      required
                    >
                      <option value="">Select a manager</option>
                      {users
                        .filter((u) => u.role === "manager")
                        .map((manager) => (
                          <option key={manager._id} value={manager._id}>
                            {manager.name} - {manager.department || "No Dept"}
                          </option>
                        ))}
                    </select>
                    {formData.managerId && (
                      <button
                        type="button"
                        onClick={async () => {
                          const managerToDelete = users.find(
                            (u) => u._id === formData.managerId,
                          );
                          if (
                            window.confirm(
                              `Delete manager "${managerToDelete?.name}"?\n\nThis will permanently remove this user from the system.`,
                            )
                          ) {
                            try {
                              await axios.delete(
                                `/users/${formData.managerId}`,
                              );
                              toast.success("Manager deleted successfully");
                              setFormData({ ...formData, managerId: "" });
                              fetchUsers();
                            } catch (error) {
                              toast.error(
                                error.response?.data?.message ||
                                  "Failed to delete manager",
                              );
                            }
                          }
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete manager"
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
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.role === "employee" ? "Employee" : "Intern"} will
                    report to this manager
                  </p>
                </div>
              )}

              {/* Reports To - Optional for managers (CEO/Admin) */}
              {formData.role === "manager" && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Reports To (Optional)
                  </label>
                  <select
                    name="managerId"
                    value={formData.managerId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
                  >
                    <option value="">Top Level (CEO)</option>
                    {users
                      .filter((u) => u.role === "admin" || u.role === "ceo")
                      .map((leader) => (
                        <option key={leader._id} value={leader._id}>
                          {leader.name} ({leader.role.toUpperCase()})
                        </option>
                      ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Use this to make a manager report directly to CEO/Admin.
                  </p>
                </div>
              )}

              {/* Department */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
                  placeholder="e.g., Operations, Marketing"
                />
              </div>

              {/* Employee Number */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Employee Number
                </label>
                <input
                  type="text"
                  name="employeeNumber"
                  value={formData.employeeNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
                  placeholder="e.g., EMP001"
                />
              </div>
            </div>

            {/* Approval Limit (only for approvers) */}
            {formData.role === "approver" && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Approval Limit (₹)
                </label>
                <input
                  type="number"
                  name="approvalLimit"
                  value={formData.approvalLimit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
                  placeholder="e.g., 50000"
                  min="0"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Maximum amount this approver can approve. Leave empty for no
                  limit.
                </p>
              </div>
            )}

            {/* Bank Details Section */}
            <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
              <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
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
                Bank Details (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="bankDetails.bankName"
                  value={formData.bankDetails.bankName}
                  onChange={handleInputChange}
                  placeholder="Bank Name"
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
                />
                <input
                  type="text"
                  name="bankDetails.accountNumber"
                  value={formData.bankDetails.accountNumber}
                  onChange={handleInputChange}
                  placeholder="Account Number"
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
                />
                <input
                  type="text"
                  name="bankDetails.ifscCode"
                  value={formData.bankDetails.ifscCode}
                  onChange={handleInputChange}
                  placeholder="IFSC Code"
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all uppercase"
                />
                <input
                  type="text"
                  name="bankDetails.branchName"
                  value={formData.bankDetails.branchName}
                  onChange={handleInputChange}
                  placeholder="Branch Name"
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
                />
                <input
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleInputChange}
                  placeholder="PAN Number"
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all uppercase"
                />
              </div>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Address"
                rows="2"
                className="w-full mt-4 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all"
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
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
                <div className="text-sm text-blue-800">
                  {editingUser ? (
                    <p>User will be notified of any changes to their account</p>
                  ) : (
                    <>
                      <p className="font-semibold mb-1">📧 Invitation Email</p>
                      <p>
                        An automated invitation will be sent with login
                        instructions and OTP setup guide. The user can login
                        immediately using their email and OTP.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                setEditingUser(null);
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  password: "",
                  role: "employee",
                  department: "",
                  employeeNumber: "",
                  approvalLimit: "",
                  bankDetails: {
                    bankName: "",
                    accountNumber: "",
                    ifscCode: "",
                    branchName: "",
                  },
                  panNumber: "",
                  address: "",
                });
              }}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-[#023e8a] to-[#0077b6] text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              {editingUser ? "Update User" : "Create User & Send Invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserFormModal;
