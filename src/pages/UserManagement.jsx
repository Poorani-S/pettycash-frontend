import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import UserManagementHeader from "../components/user-management/UserManagementHeader";
import ActivityHistoryPanel from "../components/user-management/ActivityHistoryPanel";
import UsersTable from "../components/user-management/UsersTable";
import UserFormModal from "../components/user-management/UserFormModal";
import ConfirmActionModal from "../components/user-management/ConfirmActionModal";
import PasswordResetModal from "../components/user-management/PasswordResetModal";

function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [activeTab, setActiveTab] = useState("users"); // "users" or "history"
  const [activityLogs, setActivityLogs] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    action: null,
    data: null,
    message: "",
  });
  // Password view/reset modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState(null);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "employee",
    managerId: "",
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (
      !userData ||
      (userData.role !== "admin" && userData.role !== "manager")
    ) {
      navigate("/dashboard");
      return;
    }
    fetchUsers();
  }, [navigate]);

  useEffect(() => {
    if (activeTab === "history") {
      fetchActivityLogs();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(""); // Clear any previous errors
      const response = await axios.get("/users");
      setUsers(response.data.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      // Don't show error to user, just set empty users list
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      setLoadingActivity(true);
      const response = await axios.get("/user-activity");
      setActivityLogs(response.data.data || []);
    } catch (err) {
      console.error("Error fetching activity logs:", err);
      setActivityLogs([]);
    } finally {
      setLoadingActivity(false);
    }
  };

  const exportActivityPDF = async () => {
    try {
      setLoadingActivity(true);
      const response = await axios.get("/user-activity/export/pdf", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `user-activity-log-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSuccess("Activity log downloaded successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error exporting PDF:", err);
      setError("Failed to export activity log");
    } finally {
      setLoadingActivity(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Handle nested bankDetails fields
    if (name.startsWith("bankDetails.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      let payload = {
        ...formData,
        approvalLimit:
          formData.role === "approver" && formData.approvalLimit
            ? Number(formData.approvalLimit)
            : null,
      };

      // Remove password field from payload if it's empty (for updates)
      if (
        editingUser &&
        (!payload.password || payload.password.trim() === "")
      ) {
        delete payload.password;
      }

      // Never send empty-string managerId to backend (causes ObjectId cast errors)
      if (
        typeof payload.managerId === "string" &&
        payload.managerId.trim() === ""
      ) {
        payload.managerId = null;
      }

      if (editingUser) {
        const response = await axios.put(`/users/${editingUser._id}`, payload);
        setSuccess("User updated successfully!");
        toast.success("User updated successfully!");

        // Update the user in the state immediately with the response data
        if (response.data.data) {
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u._id === editingUser._id ? response.data.data : u,
            ),
          );
        }

        // Close modal and reset form
        setShowAddModal(false);
        setEditingUser(null);
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          role: "employee",
          managerId: "",
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

        // Fetch updated user list to ensure consistency
        await fetchUsers();
      } else {
        const response = await axios.post("/users", payload);
        if (response.data.emailSent) {
          setSuccess(
            "User created successfully! Invitation email sent to " +
              formData.email,
          );
          toast.success(`User created! Invitation sent to ${formData.email}`);
        } else {
          setError(
            "User created but invitation email failed to send. Error: " +
              (response.data.emailError || "Check email configuration"),
          );
          setSuccess("User account created for " + formData.email);
          toast.warning("User created but email failed to send");
        }

        setShowAddModal(false);
        setEditingUser(null);
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          role: "employee",
          managerId: "",
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

        await fetchUsers();
      }

      // Trigger custom event to notify other components about user list changes
      window.dispatchEvent(
        new CustomEvent("usersUpdated", {
          detail: { timestamp: Date.now() },
        }),
      );

      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save user");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: "", // Don't populate password field when editing
      role: user.role,
      managerId: user.managerId?._id || user.managerId || "",
      department: user.department || "",
      employeeNumber: user.employeeNumber || "",
      approvalLimit: user.approvalLimit || "",
      bankDetails: user.bankDetails || {
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        branchName: "",
      },
      panNumber: user.panNumber || "",
      address: user.address || "",
    });
    setShowAddModal(true);
  };

  const handleDeactivate = async (userId, userName) => {
    setConfirmModal({
      show: true,
      action: "deactivate",
      data: { userId, userName },
      message: `Are you sure you want to deactivate ${userName}? They will no longer be able to login.`,
    });
  };

  const executeDeactivate = async (userId, userName) => {
    try {
      await axios.patch(`/users/${userId}/deactivate`);
      toast.success("User deactivated successfully");
      fetchUsers();

      // Trigger custom event to notify other components about user list changes
      window.dispatchEvent(
        new CustomEvent("usersUpdated", {
          detail: { timestamp: Date.now() },
        }),
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to deactivate user");
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    try {
      await axios.delete(`/users/${userId}`);
      toast.success(`User "${userName}" deleted successfully`);
      fetchUsers();

      // Trigger custom event to notify other components about user list changes
      window.dispatchEvent(
        new CustomEvent("usersUpdated", {
          detail: { timestamp: Date.now() },
        }),
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleDeleteActivityLog = async (logId) => {
    try {
      await axios.delete(`/user-activity/${logId}`);
      toast.success("Activity log entry deleted successfully");

      // Remove the log from local state immediately
      setActivityLogs((prevLogs) =>
        prevLogs.filter((log) => log._id !== logId),
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete activity log",
      );
    }
  };

  // Handle reset/regenerate user password
  const handleResetPassword = async (userId, userName) => {
    setPasswordLoading(true);
    try {
      const response = await axios.post(`/users/${userId}/reset-password`);
      if (response.data.success) {
        setGeneratedPassword(response.data.data.newPassword);
        setSelectedUserForPassword({
          userId,
          name: userName,
          email: response.data.data.email,
        });
        setShowPasswordModal(true);
        toast.success(
          `New password generated for ${userName}. Copy it from the modal.`,
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Copy password to clipboard
  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    toast.success("Password copied to clipboard!");
  };

  // Close password modal
  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setGeneratedPassword(null);
    setSelectedUserForPassword(null);
  };

  const handleDeleteUserFromLog = async (userId, userName) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete user "${userName}"? This action cannot be undone.`,
      )
    ) {
      await handleDeleteUser(userId, userName);
    }
  };

  const handleClearAllActivityLogs = async () => {
    try {
      setLoadingActivity(true);
      await axios.delete("/user-activity/clear-all");
      toast.success("All activity logs cleared successfully");
      setActivityLogs([]);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to clear activity logs",
      );
    } finally {
      setLoadingActivity(false);
    }
  };

  const executeDelete = async (userId, userName) => {
    try {
      await axios.delete(`/users/${userId}`);
      toast.success(`User ${userName} deleted successfully`);
      fetchUsers();
      fetchActivityLogs(); // Refresh activity logs

      // Trigger custom event to notify other components about user list changes
      window.dispatchEvent(
        new CustomEvent("usersUpdated", {
          detail: { timestamp: Date.now() },
        }),
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleResendInvitation = async (userId, userName, userEmail) => {
    setConfirmModal({
      show: true,
      action: "resend",
      data: { userId, userName, userEmail },
      message: `Resend invitation email to ${userName} (${userEmail})?`,
    });
  };

  const executeResendInvitation = async (userId, userName, userEmail) => {
    try {
      await axios.post(`/users/${userId}/resend-invitation`);
      toast.success(`Invitation email sent successfully to ${userEmail}`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to send invitation email",
      );
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "employee",
      managerId: "",
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
    setShowAddModal(true);
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: "bg-purple-100 text-purple-800 border-purple-200",
      manager: "bg-indigo-100 text-indigo-800 border-indigo-200",
      employee: "bg-cyan-100 text-cyan-800 border-cyan-200",
      intern: "bg-pink-100 text-pink-800 border-pink-200",

      approver: "bg-green-100 text-green-800 border-green-200",
      auditor: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return colors[role] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getRoleIcon = (role) => {
    return null;
  };

  return (
    <Layout>
      <UserManagementHeader openAddModal={openAddModal} />

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 animate-slideInDown">
          <div className="flex items-center gap-2">
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-xl mb-6 animate-slideInDown">
          <div className="flex items-center gap-2">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">{success}</span>
          </div>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            activeTab === "users"
              ? "bg-gradient-to-r from-[#023e8a] to-[#0077b6] text-white shadow-lg"
              : "bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200"
          }`}
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          Users
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            activeTab === "history"
              ? "bg-gradient-to-r from-[#023e8a] to-[#0077b6] text-white shadow-lg"
              : "bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200"
          }`}
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Activity History
        </button>
      </div>

      {/* Activity History */}
      {activeTab === "history" && (
        <ActivityHistoryPanel
          activityLogs={activityLogs}
          loadingActivity={loadingActivity}
          exportActivityPDF={exportActivityPDF}
          handleClearAllActivityLogs={handleClearAllActivityLogs}
          handleDeleteUserFromLog={handleDeleteUserFromLog}
          handleDeleteActivityLog={handleDeleteActivityLog}
        />
      )}

      {/* Users List */}
      {activeTab === "users" && (
        <UsersTable
          users={users}
          loading={loading}
          openAddModal={openAddModal}
          handleEdit={handleEdit}
          handleDeactivate={handleDeactivate}
          handleResetPassword={handleResetPassword}
          handleDeleteUser={handleDeleteUser}
          handleResendInvitation={handleResendInvitation}
          getRoleBadgeColor={getRoleBadgeColor}
          getRoleIcon={getRoleIcon}
          passwordLoading={passwordLoading}
        />
      )}

      {/* Add/Edit User Modal */}
      {showAddModal && (
        <UserFormModal
          editingUser={editingUser}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          setShowAddModal={setShowAddModal}
          setEditingUser={setEditingUser}
          setFormData={setFormData}
          users={users}
          fetchUsers={fetchUsers}
        />
      )}

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <ConfirmActionModal
          confirmModal={confirmModal}
          setConfirmModal={setConfirmModal}
          executeDeactivate={executeDeactivate}
          executeDelete={executeDelete}
          executeResendInvitation={executeResendInvitation}
        />
      )}

      {/* Password Reset Modal */}
      {showPasswordModal && selectedUserForPassword && (
        <PasswordResetModal
          selectedUserForPassword={selectedUserForPassword}
          generatedPassword={generatedPassword}
          copyPasswordToClipboard={copyPasswordToClipboard}
          closePasswordModal={closePasswordModal}
        />
      )}
    </Layout>
  );
}

export default UserManagement;
