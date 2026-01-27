import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import Layout from "../components/Layout";
import { toast } from "react-toastify";

const Transactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    action: null,
    data: null,
    message: "",
  });
  const [rejectModal, setRejectModal] = useState({
    show: false,
    transactionId: null,
  });
  const [rejectComment, setRejectComment] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchTransactions();
  }, [filter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = filter !== "all" ? { status: filter } : {};
      const response = await axios.get("/transactions", { params });
      setTransactions(response.data.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      toast.error("Failed to load transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setConfirmModal({
      show: true,
      action: "approve",
      data: { id },
      message: "Are you sure you want to approve this transaction?",
    });
  };

  const executeApprove = async (id) => {
    try {
      setProcessingId(id);
      const response = await axios.patch(`/transactions/${id}/approve`);

      if (response.data.success) {
        toast.success("Transaction approved successfully!");
        await fetchTransactions();
      }
    } catch (err) {
      console.error("Approve error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to approve transaction. Please try again.";
      toast.error(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    setRejectModal({ show: true, transactionId: id });
    setRejectComment("");
  };

  const executeReject = async () => {
    if (!rejectComment || rejectComment.trim() === "") {
      toast.warning("Rejection reason is required!");
      return;
    }

    const id = rejectModal.transactionId;
    setRejectModal({ show: false, transactionId: null });

    try {
      setProcessingId(id);
      const response = await axios.patch(`/transactions/${id}/reject`, {
        comment: rejectComment.trim(),
      });

      if (response.data.success) {
        toast.success("Transaction rejected successfully!");
        await fetchTransactions();
      }
    } catch (err) {
      console.error("Reject error:", err);
      console.error("Error response:", err.response?.data);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to reject transaction. Please try again.";
      toast.error(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return badges[status] || "bg-gray-100 text-gray-700";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
    total: transactions.length,
    pending: transactions.filter((t) => t.status === "pending").length,
    approved: transactions.filter((t) => t.status === "approved").length,
    rejected: transactions.filter((t) => t.status === "rejected").length,
    totalAmount: transactions.reduce(
      (sum, t) => sum + (t.postTaxAmount || 0),
      0,
    ),
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-8 animate-slideInUp">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#023e8a] to-[#0077b6] bg-clip-text text-transparent mb-2">
              Transaction Management
            </h1>
            <p className="text-gray-600 text-lg">
              {user?.role === "admin"
                ? "View and manage all transactions across the organization"
                : user?.role === "manager"
                  ? "View and manage your team's expense transactions"
                  : "View, manage and track your expense transactions"}
            </p>
          </div>
          {(user?.role !== "admin" || user?.role === "manager") && (
            <button
              onClick={() => navigate("/transactions/new")}
              className="px-6 py-3 bg-gradient-to-r from-[#023e8a] to-[#0077b6] text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 group shadow-md"
            >
              <svg
                className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
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
              <span className="font-semibold">New Expense</span>
            </button>
          )}
        </div>

        {/* Role-based info banner */}
        {user?.role === "manager" && (
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5"
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
              <div>
                <p className="font-semibold text-blue-800 mb-1">Manager View</p>
                <p className="text-blue-700 text-sm">
                  You can view and approve transactions from your team members
                  (employees and interns under your management).
                </p>
              </div>
            </div>
          </div>
        )}
        {user?.role === "employee" && (
          <div className="bg-green-50 border-l-4 border-green-500 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
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
              <div>
                <p className="font-semibold text-green-800 mb-1">
                  Employee View
                </p>
                <p className="text-green-700 text-sm">
                  You can view your submitted expense transactions and track
                  their approval status.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-hover transition-all duration-300 card-hover animate-slideInLeft border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <svg
              className="w-10 h-10 text-blue-500"
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
          <p className="text-gray-600 text-sm font-semibold mb-1">
            Total Transactions
          </p>
          <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
        </div>

        <div
          className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-hover transition-all duration-300 card-hover animate-slideInLeft border-l-4 border-yellow-500"
          style={{ animationDelay: "50ms" }}
        >
          <div className="flex items-center justify-between mb-2">
            <svg
              className="w-10 h-10 text-yellow-500"
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
          <p className="text-gray-600 text-sm font-semibold mb-1">Pending</p>
          <p className="text-3xl font-bold text-gray-800">{stats.pending}</p>
        </div>

        <div
          className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-hover transition-all duration-300 card-hover animate-slideInLeft border-l-4 border-green-500"
          style={{ animationDelay: "100ms" }}
        >
          <div className="flex items-center justify-between mb-2">
            <svg
              className="w-10 h-10 text-green-500"
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
          <p className="text-gray-600 text-sm font-semibold mb-1">Approved</p>
          <p className="text-3xl font-bold text-gray-800">{stats.approved}</p>
        </div>

        <div
          className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-hover transition-all duration-300 card-hover animate-slideInLeft border-l-4 border-red-500"
          style={{ animationDelay: "150ms" }}
        >
          <div className="flex items-center justify-between mb-2">
            <svg
              className="w-10 h-10 text-red-500"
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
          <p className="text-gray-600 text-sm font-semibold mb-1">Rejected</p>
          <p className="text-3xl font-bold text-gray-800">{stats.rejected}</p>
        </div>

        <div
          className="bg-gradient-to-br from-[#023e8a] to-[#0077b6] rounded-2xl p-6 shadow-soft hover:shadow-hover transition-all duration-300 card-hover animate-slideInLeft text-white border-l-4 border-white"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex items-center justify-between mb-2">
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-blue-100 text-sm font-semibold mb-1">
            Total Amount
          </p>
          <p className="text-3xl font-bold">
            ₹{stats.totalAmount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div
        className="bg-white rounded-2xl shadow-soft p-6 mb-8 animate-slideInUp"
        style={{ animationDelay: "250ms" }}
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {["all", "pending", "approved", "rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  filter === f
                    ? "bg-gradient-to-r from-[#023e8a] to-[#0077b6] text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {f === "all" && (
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
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                )}
                {f === "pending" && (
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {f === "approved" && (
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {f === "rejected" && (
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
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-96">
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-soft p-12 text-center animate-fadeIn">
          <div className="w-16 h-16 border-4 border-[#0077b6] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-semibold mt-4 text-lg">
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
              className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-hover transition-all duration-300 card-hover animate-slideInRight border-l-4 border-transparent hover:border-[#0077b6]"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-[#023e8a]/10 to-[#0077b6]/10 px-4 py-2 rounded-xl">
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
                      <span className="font-bold text-[#023e8a]">
                        {transaction.category?.name}
                      </span>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 ${getStatusBadge(transaction.status)}`}
                    >
                      {transaction.status === "approved" && (
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
                      )}
                      {transaction.status === "pending" && (
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                      {transaction.status === "rejected" && (
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
                      )}
                      {transaction.status.toUpperCase()}
                    </span>
                    {transaction.hasGSTInvoice && (
                      <span className="px-4 py-2 rounded-xl text-sm font-bold bg-blue-100 text-blue-700 flex items-center gap-2">
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        GST Invoice
                      </span>
                    )}
                  </div>
                  <p className="text-gray-800 font-semibold mb-2 text-lg">
                    {transaction.purpose}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-2">
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      {transaction.payeeClientName}
                    </span>
                    <span className="flex items-center gap-2">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {formatDate(transaction.paymentDate)}
                    </span>
                    <span className="flex items-center gap-2">
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
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      {transaction.paymentMode}
                    </span>
                  </div>
                </div>
                <div className="text-right lg:text-right">
                  <p className="text-3xl font-bold text-[#023e8a]">
                    ₹{transaction.postTaxAmount.toLocaleString("en-IN")}
                  </p>
                  {transaction.taxAmount > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Tax: ₹{transaction.taxAmount.toLocaleString("en-IN")}
                    </p>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-100 gap-4">
                <p className="text-sm text-gray-500 flex items-center gap-2">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Submitted by{" "}
                  <span className="font-semibold">
                    {transaction.submittedBy?.name}
                  </span>{" "}
                  on {formatDate(transaction.createdAt)}
                </p>

                <div className="flex items-center gap-3">
                  {(user?.role === "admin" || user?.role === "manager") &&
                    transaction.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleReject(transaction._id)}
                          disabled={processingId === transaction._id}
                          className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingId === transaction._id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Processing...
                            </>
                          ) : (
                            <>
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
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleApprove(transaction._id)}
                          disabled={processingId === transaction._id}
                          className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingId === transaction._id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Processing...
                            </>
                          ) : (
                            <>
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
                            </>
                          )}
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

      {/* Confirmation Modal */}
      {confirmModal.show && (
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Confirm Action
              </h3>
            </div>
            <p className="text-gray-700 mb-6">{confirmModal.message}</p>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setConfirmModal({
                    show: false,
                    action: null,
                    data: null,
                    message: "",
                  })
                }
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const { action, data } = confirmModal;
                  setConfirmModal({
                    show: false,
                    action: null,
                    data: null,
                    message: "",
                  });
                  if (action === "approve") executeApprove(data.id);
                }}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideInUp">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
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
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Reject Transaction
              </h3>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
                placeholder="Enter the reason for rejection..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
                rows="4"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRejectModal({ show: false, transactionId: null });
                  setRejectComment("");
                }}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={executeReject}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
              >
                Reject Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Transactions;
