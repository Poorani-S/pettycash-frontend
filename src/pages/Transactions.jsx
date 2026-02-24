import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import Layout from "../components/Layout";

// Build a URL to view an uploaded file from the stored path
const getFileUrl = (filePath) => {
  if (!filePath) return null;
  const normalized = filePath.replace(/\\/g, "/");
  const idx = normalized.indexOf("uploads/");
  if (idx === -1) return null;
  const base = (
    import.meta.env.VITE_API_URL || "http://localhost:5000/api"
  ).replace(/\/api$/, "");
  return `${base}/${normalized.substring(idx)}`;
};

const Transactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [fundTransfers, setFundTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewTx, setReviewTx] = useState(null); // transaction in the review modal
  const [lightboxUrl, setLightboxUrl] = useState(null); // full-size image lightbox
  const [rejectModal, setRejectModal] = useState({ open: false, id: null }); // reject reason dialog
  const [rejectComment, setRejectComment] = useState("");
  const [summary, setSummary] = useState({
    expense: {
      totalTransactions: 0,
      totalAmount: 0,
      pendingCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
    },
    fundTransfers: {
      overall: { total: 0, count: 0 },
      bank: { totalAmount: 0, count: 0 },
      cash: { totalAmount: 0, count: 0 },
    },
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchTransactions();
    fetchFinancialSummary();

    // Listen for transaction updates from other pages
    const handleTransactionUpdate = () => {
      fetchTransactions();
      fetchFinancialSummary();
    };

    window.addEventListener("transactionsUpdated", handleTransactionUpdate);

    return () => {
      window.removeEventListener(
        "transactionsUpdated",
        handleTransactionUpdate,
      );
    };
  }, [filter]);

  const fetchFinancialSummary = async () => {
    try {
      const response = await axios.get("/reports/financial-summary");
      const data = response.data.data;
      const expense = data?.expenseTransactions?.summary || {};
      const byType = data?.fundTransfers?.byType || {};

      setSummary({
        expense: {
          totalTransactions: expense.totalTransactions || 0,
          totalAmount: expense.totalAmount || 0,
          pendingCount: expense.pendingCount || 0,
          approvedCount: expense.approvedCount || 0,
          rejectedCount: expense.rejectedCount || 0,
        },
        fundTransfers: {
          overall: data?.fundTransfers?.overall || { total: 0, count: 0 },
          bank: byType.bank || { totalAmount: 0, count: 0 },
          cash: byType.cash || { totalAmount: 0, count: 0 },
        },
      });

      // Also fetch fund transfers list so the page has meaningful data even if there are no expense transactions
      const ftRes = await axios.get("/fund-transfers?limit=50");
      setFundTransfers(ftRes.data.data || []);
    } catch (err) {
      console.error("Error fetching financial summary:", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = filter !== "all" ? { status: filter } : {};
      const response = await axios.get("/transactions", { params });
      setTransactions(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(`/transactions/${id}/approve`);
      setReviewTx(null);
      await fetchTransactions();
      await fetchFinancialSummary();
      window.dispatchEvent(
        new CustomEvent("transactionsUpdated", {
          detail: { action: "approved" },
        }),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve transaction");
    }
  };

  const handleClearAll = async () => {
    if (
      !window.confirm(
        "Are you sure you want to DELETE ALL transactions? This action cannot be undone.",
      )
    )
      return;
    try {
      const res = await axios.delete("/transactions/clear-all");
      setTransactions([]);
      await fetchFinancialSummary();
      window.dispatchEvent(new CustomEvent("transactionsUpdated"));
      alert(res.data.message || "All transactions cleared.");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to clear transactions.");
    }
  };

  const handleReject = async (id, comment) => {
    try {
      await axios.patch(`/transactions/${id}/reject`, { comment });
      setReviewTx(null);
      setRejectModal({ open: false, id: null });
      setRejectComment("");
      await fetchTransactions();
      await fetchFinancialSummary();
      window.dispatchEvent(
        new CustomEvent("transactionsUpdated", {
          detail: { action: "rejected" },
        }),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject transaction");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-700",
      pending_approval: "bg-yellow-100 text-yellow-700",
      info_requested: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      paid: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      draft: "bg-gray-100 text-gray-700",
    };
    return badges[status] || "bg-gray-100 text-gray-700";
  };

  const isPendingLike = (status) =>
    ["pending", "pending_approval", "info_requested"].includes(status);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (value) => {
    const numberValue =
      typeof value === "number" ? value : value ? Number(value) : 0;
    if (!Number.isFinite(numberValue)) return "0";
    return numberValue.toLocaleString("en-IN");
  };

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.payeeClientName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.purpose?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const stats = {
    total:
      summary.expense.totalTransactions + summary.fundTransfers.overall.count,
    pending: summary.expense.pendingCount,
    approved:
      summary.expense.approvedCount + summary.fundTransfers.overall.count,
    rejected: summary.expense.rejectedCount,
    totalAmount:
      summary.expense.totalAmount + summary.fundTransfers.overall.total,
  };

  return (
    <Layout>
      <div>
        {/* Page Header */}
        <div className="mb-6 md:mb-8 animate-slideInUp">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#023e8a] to-[#0077b6] bg-clip-text text-transparent mb-2">
                Transaction Management
              </h1>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                View, manage and track all expense transactions
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {user?.role === "admin" && (
                <button
                  onClick={handleClearAll}
                  className="flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md font-semibold text-sm sm:text-base"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
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
                  <span className="hidden sm:inline">Clear All</span>
                  <span className="sm:hidden">Clear</span>
                </button>
              )}
              <button
                onClick={() => navigate("/transactions/new")}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#023e8a] to-[#0077b6] text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group shadow-md text-sm sm:text-base"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300"
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
                <span className="font-semibold">New</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft hover:shadow-hover transition-all duration-300 card-hover animate-slideInLeft border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1">
              Total Transactions
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">
              {stats.total}
            </p>
          </div>

          <div
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft hover:shadow-hover transition-all duration-300 card-hover animate-slideInLeft border-l-4 border-yellow-500"
            style={{ animationDelay: "50ms" }}
          >
            <div className="flex items-center justify-between mb-2">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500"
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
            </div>
            <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1">
              Pending
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">
              {stats.pending}
            </p>
          </div>

          <div
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft hover:shadow-hover transition-all duration-300 card-hover animate-slideInLeft border-l-4 border-green-500"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex items-center justify-between mb-2">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-green-500"
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
            </div>
            <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1">
              Approved
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">
              {stats.approved}
            </p>
          </div>

          <div
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft hover:shadow-hover transition-all duration-300 card-hover animate-slideInLeft border-l-4 border-red-500"
            style={{ animationDelay: "150ms" }}
          >
            <div className="flex items-center justify-between mb-2">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1">
              Rejected
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">
              {stats.rejected}
            </p>
          </div>

          <div
            className="bg-gradient-to-br from-[#023e8a] to-[#0077b6] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft hover:shadow-hover transition-all duration-300 card-hover animate-slideInLeft text-white border-l-4 border-white col-span-2 lg:col-span-1"
            style={{ animationDelay: "200ms" }}
          >
            <div className="flex items-center justify-between mb-2">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-blue-100 text-xs sm:text-sm font-semibold mb-1">
              Total Amount
            </p>
            <p className="text-2xl sm:text-3xl font-bold">
              ₹{stats.totalAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div
          className="bg-white rounded-xl sm:rounded-2xl shadow-soft p-4 sm:p-6 mb-6 sm:mb-8 animate-slideInUp"
          style={{ animationDelay: "250ms" }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {["all", "pending", "approved", "rejected"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 text-sm sm:text-base ${
                    filter === f
                      ? "bg-gradient-to-r from-[#023e8a] to-[#0077b6] text-white shadow-md scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {f === "all" && (
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                  )}
                  {f === "pending" && (
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
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
                  )}
                  {f === "approved" && (
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
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
                  )}
                  {f === "rejected" && (
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="relative w-full">
              <svg
                className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by payee, purpose, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300 text-sm sm:text-base"
              />
            </div>
          </div>
        </div>

        {/* Transactions List */}
        {loading ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-soft p-8 sm:p-12 text-center animate-fadeIn">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#0077b6] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 font-semibold mt-4 text-base sm:text-lg">
              Loading transactions...
            </p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-soft p-12 text-center animate-fadeIn">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No transactions found
            </h3>
            <p className="text-gray-600 mb-6">
              Start by submitting your first expense request
            </p>
            <button
              onClick={() => navigate("/transactions/new")}
              className="px-6 py-3 bg-gradient-to-r from-[#023e8a] to-[#0077b6] text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
            >
              Submit New Expense
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction, index) => (
              <div
                key={transaction._id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-soft p-4 sm:p-6 hover:shadow-hover transition-all duration-300 card-hover animate-slideInRight border-l-4 border-transparent hover:border-[#0077b6]"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                      <div className="flex items-center gap-2 bg-gradient-to-r from-[#023e8a]/10 to-[#0077b6]/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-[#0077b6] flex-shrink-0"
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
                        <span className="font-bold text-[#023e8a] text-xs sm:text-sm truncate">
                          {transaction.category?.name}
                        </span>
                      </div>
                      <span
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm flex items-center gap-2 ${getStatusBadge(transaction.status)}`}
                      >
                        {transaction.status === "approved" && (
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                        {transaction.status === "pending" && (
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
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
                        )}
                        {transaction.status === "rejected" && (
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
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
                        )}
                        {(transaction.status || "pending").toUpperCase()}
                      </span>
                      {transaction.hasGSTInvoice && (
                        <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-100 text-blue-700 flex items-center gap-2">
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          GST
                        </span>
                      )}
                    </div>
                    <p className="text-gray-800 font-semibold mb-2 text-base sm:text-lg">
                      {transaction.purpose}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <span className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 flex-shrink-0"
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
                        <span className="truncate">
                          {transaction.payeeClientName}
                        </span>
                      </span>
                      <span className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 flex-shrink-0"
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
                        {formatDate(
                          transaction.paymentDate ||
                            transaction.transactionDate ||
                            transaction.createdAt,
                        )}
                      </span>
                      <span className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        {transaction.paymentMode ||
                          transaction.paymentMethod ||
                          "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right lg:text-right">
                    <p className="text-2xl sm:text-3xl font-bold text-[#023e8a]">
                      ₹
                      {formatAmount(
                        transaction.postTaxAmount ?? transaction.amount,
                      )}
                    </p>
                    {Number(transaction.taxAmount) > 0 && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Tax: ₹{formatAmount(transaction.taxAmount)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-100 gap-3 sm:gap-4">
                  <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
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
                    <span className="truncate">
                      Submitted by{" "}
                      <span className="font-semibold">
                        {transaction.submittedBy?.name}
                      </span>{" "}
                      on {formatDate(transaction.createdAt)}
                    </span>
                  </p>

                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-wrap">
                    {/* Review button – always shown for admin */}
                    {user?.role === "admin" && (
                      <button
                        onClick={() => setReviewTx(transaction)}
                        className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 bg-[#0077b6] hover:bg-[#023e8a] text-white rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Review
                      </button>
                    )}
                    {user?.role === "admin" &&
                      isPendingLike(transaction.status) && (
                        <>
                          <button
                            onClick={() => {
                              setRejectModal({
                                open: true,
                                id: transaction._id,
                              });
                              setRejectComment("");
                            }}
                            className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                          >
                            <svg
                              className="w-3 h-3 sm:w-4 sm:h-4"
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
                            Reject
                          </button>
                          <button
                            onClick={() => handleApprove(transaction._id)}
                            className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                          >
                            <svg
                              className="w-3 h-3 sm:w-4 sm:h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Approve
                          </button>
                        </>
                      )}
                  </div>
                </div>

                {/* Rejection Comment */}
                {transaction.status === "rejected" &&
                  transaction.adminComment && (
                    <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl animate-slideInUp">
                      <p className="text-sm font-bold text-red-700 mb-1 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
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
                        Rejection Reason:
                      </p>
                      <p className="text-sm text-red-600">
                        {transaction.adminComment}
                      </p>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* ══════════════════════════════════════════════════════════
           TRANSACTION REVIEW MODAL
      ══════════════════════════════════════════════════════════ */}
      {reviewTx && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setReviewTx(null);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#023e8a] to-[#0077b6] rounded-t-2xl">
              <div>
                <h2 className="text-white font-bold text-lg">
                  Transaction Review
                </h2>
                <p className="text-blue-100 text-xs mt-0.5">
                  {reviewTx.transactionNumber || reviewTx._id}
                </p>
              </div>
              <button
                onClick={() => setReviewTx(null)}
                className="text-white hover:text-blue-200 transition-colors"
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

            <div className="p-6 space-y-6">
              {/* Status badge */}
              <div className="flex items-center gap-3">
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${getStatusBadge(reviewTx.status)}`}
                >
                  {(reviewTx.status || "pending").toUpperCase()}
                </span>
                {reviewTx.hasGSTInvoice && (
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                    GST Invoice
                  </span>
                )}
              </div>

              {/* Submitter info */}
              <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap gap-4 text-sm">
                <div className="flex-1 min-w-32">
                  <p className="text-gray-500 text-xs mb-1">Submitted by</p>
                  <p className="font-semibold text-gray-800">
                    {reviewTx.submittedBy?.name || "—"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {reviewTx.submittedBy?.email}
                  </p>
                </div>
                <div className="flex-1 min-w-32">
                  <p className="text-gray-500 text-xs mb-1">Role</p>
                  <p className="font-semibold text-gray-800 capitalize">
                    {reviewTx.submittedBy?.role || "—"}
                  </p>
                </div>
                <div className="flex-1 min-w-32">
                  <p className="text-gray-500 text-xs mb-1">Submitted on</p>
                  <p className="font-semibold text-gray-800">
                    {formatDate(reviewTx.createdAt)}
                  </p>
                </div>
              </div>

              {/* Core details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailRow
                  label="Payee / Client"
                  value={reviewTx.payeeClientName}
                />
                <DetailRow label="Category" value={reviewTx.category?.name} />
                <DetailRow label="Purpose" value={reviewTx.purpose} span />
                <DetailRow
                  label="Payment Date"
                  value={formatDate(reviewTx.paymentDate)}
                />
                <DetailRow
                  label="Payment Mode"
                  value={reviewTx.paymentMode || reviewTx.paymentMethod}
                />
                {reviewTx.transactionId && (
                  <DetailRow
                    label="Transaction / Ref ID"
                    value={reviewTx.transactionId}
                  />
                )}
                {reviewTx.invoiceDate && (
                  <DetailRow
                    label="Invoice Date"
                    value={formatDate(reviewTx.invoiceDate)}
                  />
                )}
              </div>

              {/* Amount breakdown */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="text-sm font-bold text-[#023e8a] mb-3">
                  Amount Breakdown
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Pre-Tax</p>
                    <p className="text-lg font-bold text-gray-700">
                      ₹{formatAmount(reviewTx.preTaxAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Tax</p>
                    <p className="text-lg font-bold text-gray-700">
                      ₹{formatAmount(reviewTx.taxAmount)}
                    </p>
                  </div>
                  <div className="border-l-2 border-[#0077b6]">
                    <p className="text-xs text-gray-500 mb-1">Total</p>
                    <p className="text-2xl font-extrabold text-[#023e8a]">
                      ₹{formatAmount(reviewTx.postTaxAmount ?? reviewTx.amount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Documents section */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  Attached Documents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DocumentCard
                    label="Invoice / Bill"
                    filePath={reviewTx.invoiceImage}
                    onView={setLightboxUrl}
                  />
                  <DocumentCard
                    label="Payment Proof"
                    filePath={reviewTx.paymentProofImage}
                    onView={setLightboxUrl}
                  />
                </div>
              </div>

              {/* Rejection reason if already rejected */}
              {reviewTx.status === "rejected" && reviewTx.adminComment && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4">
                  <p className="text-sm font-bold text-red-700 mb-1">
                    Rejection Reason
                  </p>
                  <p className="text-sm text-red-600">
                    {reviewTx.adminComment}
                  </p>
                </div>
              )}

              {/* Action buttons (only for pending-like) */}
              {isPendingLike(reviewTx.status) && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setRejectModal({ open: true, id: reviewTx._id });
                      setRejectComment("");
                    }}
                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
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
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(reviewTx._id)}
                    className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
           REJECT REASON MODAL
      ══════════════════════════════════════════════════════════ */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-500"
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
              Rejection Reason
            </h3>
            <textarea
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              placeholder="Enter the reason for rejection (required)…"
              rows={4}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setRejectModal({ open: false, id: null });
                  setRejectComment("");
                }}
                className="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!rejectComment.trim()) {
                    alert("Please enter a rejection reason.");
                    return;
                  }
                  handleReject(rejectModal.id, rejectComment.trim());
                }}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
           IMAGE LIGHTBOX
      ══════════════════════════════════════════════════════════ */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setLightboxUrl(null)}
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
          <img
            src={lightboxUrl}
            alt="Document"
            className="max-w-full max-h-full rounded-xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </Layout>
  );
};

// ── Small helper components ───────────────────────────────────────────────
const DetailRow = ({ label, value, span }) => (
  <div className={span ? "sm:col-span-2" : ""}>
    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
    <p className="font-semibold text-gray-800 text-sm">{value || "—"}</p>
  </div>
);

const DocumentCard = ({ label, filePath, onView }) => {
  const url = getFileUrl(filePath);
  const isPdf = filePath?.toLowerCase().endsWith(".pdf");

  return (
    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center gap-3 bg-gray-50">
      <p className="text-xs font-bold text-gray-600 self-start">{label}</p>
      {url ? (
        <>
          {isPdf ? (
            <div className="flex flex-col items-center gap-2">
              <svg
                className="w-12 h-12 text-red-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7H20.5v1.5z" />
              </svg>
              <span className="text-xs text-gray-500">PDF Document</span>
            </div>
          ) : (
            <img
              src={url}
              alt={label}
              className="w-full h-36 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity border border-gray-200"
              onClick={() => onView(url)}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
          <div className="flex gap-2 w-full">
            {!isPdf && (
              <button
                onClick={() => onView(url)}
                className="flex-1 py-2 text-xs font-semibold text-[#0077b6] bg-blue-50 hover:bg-blue-100 rounded-lg transition-all flex items-center justify-center gap-1"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Full View
              </button>
            )}
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all flex items-center justify-center gap-1"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download
            </a>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 py-4 text-gray-400">
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-xs">No file attached</p>
        </div>
      )}
    </div>
  );
};

export default Transactions;
