import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import ReportHeader from "../components/reports/ReportHeader";
import ReportFilters from "../components/reports/ReportFilters";
import ReportActionButtons from "../components/reports/ReportActionButtons";
import SummaryStatsCards from "../components/reports/SummaryStatsCards";
import ReportDataDisplay from "../components/reports/ReportDataDisplay";
import AddUserModal from "../components/reports/AddUserModal";
import ReportConfirmModal from "../components/reports/ReportConfirmModal";

const Reports = () => {
  const navigate = useNavigate();
  const CEO_EMAIL = import.meta.env.VITE_CEO_EMAIL || "mikeykalai17@gmail.com";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [summaryStats, setSummaryStats] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    approvedCount: 0,
    approvedAmount: 0,
    pendingCount: 0,
    pendingAmount: 0,
    rejectedCount: 0,
    rejectedAmount: 0,
  });
  const [fundTransferSummary, setFundTransferSummary] = useState({
    overall: { total: 0, count: 0 },
    bank: { totalAmount: 0, count: 0 },
    cash: { totalAmount: 0, count: 0 },
  });
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [lastUsersFetch, setLastUsersFetch] = useState(null);

  // Filter states
  const [reportType, setReportType] = useState("summary");
  const [period, setPeriod] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    action: null,
    message: "",
  });

  // New user modal states
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserLoading, setNewUserLoading] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    category: "vendor",
    bankDetails: {
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      accountHolderName: "",
    },
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchCategories();
    fetchUsers();
    // Fetch summary stats immediately on page load
    fetchSummaryStats();

    // Auto-refresh users and report every 30 seconds for admin users
    const userObj = JSON.parse(userData || "{}");
    if (userObj.role === "admin") {
      const interval = setInterval(() => {
        fetchUsers();
        // Auto-refresh report data silently
        refreshReportData();
        fetchSummaryStats();
      }, 30000); // Refresh every 30 seconds

      // Also refresh when tab becomes visible (user returns to the tab)
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          fetchUsers();
          // Refresh report data when tab becomes visible
          refreshReportData();
          fetchSummaryStats();
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        clearInterval(interval);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
      };
    }
  }, []);

  // Refresh users when component comes into focus (e.g., returning from User Management)
  useEffect(() => {
    const handleFocus = () => {
      // Only refresh if user is admin and we have a stale users list
      if (user?.role === "admin" && lastUsersFetch) {
        const timeSinceLastFetch = Date.now() - lastUsersFetch.getTime();
        if (timeSinceLastFetch > 10000) {
          // If more than 10 seconds old, refresh
          fetchUsers();
        }
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user?.role, lastUsersFetch]);

  // Listen for user updates from other components (like User Management)
  useEffect(() => {
    const handleUsersUpdated = (event) => {
      if (user?.role === "admin") {
        fetchUsers();
      }
    };

    window.addEventListener("usersUpdated", handleUsersUpdated);
    return () => window.removeEventListener("usersUpdated", handleUsersUpdated);
  }, [user?.role]);

  // Listen for transaction updates from other components (like Transactions, NewTransaction)
  useEffect(() => {
    const handleTransactionsUpdated = (event) => {
      // Refresh report data and summary stats when transactions are updated
      refreshReportData();
      fetchSummaryStats();
    };

    window.addEventListener("transactionsUpdated", handleTransactionsUpdated);
    return () =>
      window.removeEventListener(
        "transactionsUpdated",
        handleTransactionsUpdated,
      );
  }, [
    reportType,
    period,
    customStartDate,
    customEndDate,
    selectedCategory,
    selectedStatus,
    selectedUser,
  ]);

  // Auto-generate report when filters change
  useEffect(() => {
    // Don't generate report until user data is loaded
    if (!user) return;

    // Only generate if not using custom date range, or if custom dates are set
    if (period !== "custom" || (customStartDate && customEndDate)) {
      console.log("Generating report with filters:", {
        reportType,
        period,
        selectedCategory,
        selectedStatus,
        selectedUser: selectedUser || "All Users",
      });
      generateReport();
    }
  }, [
    user,
    reportType,
    period,
    selectedCategory,
    selectedStatus,
    selectedUser,
    customStartDate,
    customEndDate,
  ]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/categories");
      setCategories(response.data.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Fetch unified summary stats from backend (prevents drift across pages)
  const fetchSummaryStats = async () => {
    try {
      const params =
        period === "all"
          ? {}
          : period === "custom"
            ? { startDate: customStartDate, endDate: customEndDate }
            : { period };

      const financialRes = await axios.get("/reports/financial-summary", {
        params,
      });

      const data = financialRes.data?.data;
      const expense = data?.expenseTransactions?.summary || {};
      const fundOverall = data?.fundTransfers?.overall || {
        total: 0,
        count: 0,
      };
      const byType = data?.fundTransfers?.byType || {};

      setSummaryStats({
        totalTransactions: expense.totalTransactions || 0,
        totalAmount: expense.totalAmount || 0,
        approvedCount: expense.approvedCount || 0,
        approvedAmount: expense.approvedAmount || 0,
        pendingCount: expense.pendingCount || 0,
        pendingAmount: expense.pendingAmount || 0,
        rejectedCount: expense.rejectedCount || 0,
        rejectedAmount: expense.rejectedAmount || 0,
      });

      setFundTransferSummary({
        overall: {
          total: fundOverall.total || 0,
          count: fundOverall.count || 0,
        },
        bank: byType.bank || { totalAmount: 0, count: 0 },
        cash: byType.cash || { totalAmount: 0, count: 0 },
      });
    } catch (err) {
      console.error("❌ Error fetching summary stats:", err);
      console.error("Error details:", err.message, err.response);
    }
  };

  const fetchUsers = async (showLoader = false) => {
    try {
      if (showLoader) setUsersLoading(true);
      const response = await axios.get("/users");
      const fetchedUsers = response.data.data || [];
      // Filter only active users for the dropdown
      const activeUsers = fetchedUsers.filter((u) => u.isActive !== false);
      setUsers(activeUsers);
      setLastUsersFetch(new Date());
      console.log("Fetched users for dropdown:", activeUsers.length);
    } catch (err) {
      console.error("Error fetching users:", err);
      // Silently fail - users dropdown will remain empty
      setUsers([]);
    } finally {
      if (showLoader) setUsersLoading(false);
    }
  };

  const handleUserChange = (e) => {
    const value = e.target.value;
    console.log("User dropdown changed to:", value);
    if (value === "add_new") {
      setShowAddUserModal(true);
      // Reset to previous value or empty
      e.target.value = selectedUser;
    } else {
      setSelectedUser(value);
      // Trigger report regeneration will happen via useEffect
    }
  };

  const handleAddNewUser = async (e) => {
    e.preventDefault();
    setNewUserLoading(true);
    try {
      const response = await axios.post("/clients", newClient);
      // Refresh users list immediately after adding new user
      await fetchUsers();
      setShowAddUserModal(false);
      // Set the newly added user as selected if response contains user ID
      if (response.data.data && response.data.data._id) {
        setSelectedUser(response.data.data._id);
      }
      // Show success notification
      toast.success(
        `User "${newClient.name}" has been successfully created and added to the user list!`,
      );

      // Trigger custom event to notify other components about user list changes
      window.dispatchEvent(
        new CustomEvent("usersUpdated", {
          detail: { timestamp: Date.now() },
        }),
      );
      setNewClient({
        name: "",
        email: "",
        phone: "",
        address: "",
        category: "vendor",
        bankDetails: {
          bankName: "",
          accountNumber: "",
          ifscCode: "",
          accountHolderName: "",
        },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add user");
    } finally {
      setNewUserLoading(false);
    }
  };

  // Silent refresh for auto-update (without showing loading state)
  const refreshReportData = async () => {
    try {
      let params = {};

      if (period === "custom") {
        if (customStartDate) params.startDate = customStartDate;
        if (customEndDate) params.endDate = customEndDate;
      } else {
        params.period = period;
      }

      if (selectedCategory) params.category = selectedCategory;
      if (selectedStatus) params.status = selectedStatus;
      if (selectedUser) params.userId = selectedUser;

      let endpoint = "/reports/summary";
      if (reportType === "category") endpoint = "/reports/by-category";
      if (reportType === "monthly") endpoint = "/reports/monthly-trend";

      const response = await axios.get(endpoint, { params });
      setReportData(response.data.data);
    } catch (err) {
      // Silent fail for auto-refresh
      console.error("Error refreshing report:", err);
    }
  };

  const handleClearAllData = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete ALL transactions? This cannot be undone.",
      )
    )
      return;
    try {
      await axios.delete("/transactions/clear-all");
      toast.success("All transaction data cleared successfully");
      setReportData(null);
      setSummaryStats({
        totalTransactions: 0,
        totalAmount: 0,
        approvedCount: 0,
        approvedAmount: 0,
        pendingCount: 0,
        pendingAmount: 0,
        rejectedCount: 0,
        rejectedAmount: 0,
      });
      window.dispatchEvent(new Event("transactionsUpdated"));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to clear data");
    }
  };

  const generateReport = async () => {
    try {
      setLoading(true);

      let params = {};

      if (period === "custom") {
        if (customStartDate) params.startDate = customStartDate;
        if (customEndDate) params.endDate = customEndDate;
      } else {
        params.period = period;
      }

      if (selectedCategory) params.category = selectedCategory;
      if (selectedStatus) params.status = selectedStatus;
      if (selectedUser) params.userId = selectedUser;

      let endpoint = "/reports/summary";
      if (reportType === "category") endpoint = "/reports/by-category";
      if (reportType === "monthly") endpoint = "/reports/monthly-trend";

      const response = await axios.get(endpoint, { params });
      setReportData(response.data.data);
    } catch (err) {
      console.error("Error generating report:", err);
      toast.error(err.response?.data?.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const sendCEOReport = async () => {
    setConfirmModal({
      show: true,
      action: "sendCEO",
      message: `Send admin transaction report to CEO at ${CEO_EMAIL}?`,
    });
  };

  const executeSendCEOReport = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/transactions/send-ceo-report");

      if (response.data.success) {
        toast.success(
          `Report sent successfully to CEO! Transactions included: ${response.data.transactionCount}`,
        );
      }
    } catch (err) {
      console.error("Error sending CEO report:", err);
      toast.error(err.response?.data?.message || "Failed to send CEO report");
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    try {
      setLoading(true);
      let params = {};

      if (period === "custom") {
        if (customStartDate) params.startDate = customStartDate;
        if (customEndDate) params.endDate = customEndDate;
      } else {
        params.period = period;
      }

      if (selectedCategory) params.category = selectedCategory;
      if (selectedStatus) params.status = selectedStatus;
      if (selectedUser) params.userId = selectedUser;

      const response = await axios.get("/reports/export/pdf", {
        params,
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `petty-cash-report-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error exporting PDF:", err);
      toast.error("Failed to export PDF");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    try {
      setLoading(true);
      let params = {};

      if (period === "custom") {
        if (customStartDate) params.startDate = customStartDate;
        if (customEndDate) params.endDate = customEndDate;
      } else {
        params.period = period;
      }

      if (selectedCategory) params.category = selectedCategory;
      if (selectedStatus) params.status = selectedStatus;
      if (selectedUser) params.userId = selectedUser;

      const response = await axios.get("/reports/export/excel", {
        params,
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `petty-cash-report-${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error exporting Excel:", err);
      toast.error("Failed to export Excel");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString("en-IN") || 0}`;
  };

  return (
    <Layout>
      {/* Header Banner */}
      <ReportHeader user={user} handleClearAllData={handleClearAllData} />

      <div>
        {/* Filters Section */}
        <ReportFilters
          period={period}
          setPeriod={setPeriod}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          fetchCategories={fetchCategories}
          user={user}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          handleUserChange={handleUserChange}
          users={users}
          usersLoading={usersLoading}
          lastUsersFetch={lastUsersFetch}
          fetchUsers={fetchUsers}
          customStartDate={customStartDate}
          setCustomStartDate={setCustomStartDate}
          customEndDate={customEndDate}
          setCustomEndDate={setCustomEndDate}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        >
          {/* Action Buttons */}
          <ReportActionButtons
            loading={loading}
            reportData={reportData}
            user={user}
            CEO_EMAIL={CEO_EMAIL}
            generateReport={generateReport}
            exportToPDF={exportToPDF}
            exportToExcel={exportToExcel}
            sendCEOReport={sendCEOReport}
          />
        </ReportFilters>

        {/* Summary Report - Always visible */}
        <SummaryStatsCards
          summaryStats={summaryStats}
          fundTransferSummary={fundTransferSummary}
          formatCurrency={formatCurrency}
        />

        {/* Report Data Display */}
        <ReportDataDisplay
          loading={loading}
          reportData={reportData}
          reportType={reportType}
          user={user}
          formatCurrency={formatCurrency}
        />
      </div>

      {/* Add New User Modal */}
      <AddUserModal
        showAddUserModal={showAddUserModal}
        setShowAddUserModal={setShowAddUserModal}
        newClient={newClient}
        setNewClient={setNewClient}
        newUserLoading={newUserLoading}
        handleAddNewUser={handleAddNewUser}
      />

      {/* Confirmation Modal */}
      <ReportConfirmModal
        confirmModal={confirmModal}
        setConfirmModal={setConfirmModal}
        executeSendCEOReport={executeSendCEOReport}
      />
    </Layout>
  );
};

export default Reports;
