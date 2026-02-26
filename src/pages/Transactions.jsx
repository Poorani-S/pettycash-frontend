import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import Layout from "../components/Layout";
import TransactionStatsCards from "../components/transactions/TransactionStatsCards";
import TransactionFilterBar from "../components/transactions/TransactionFilterBar";
import TransactionCard from "../components/transactions/TransactionCard";
import TransactionReviewModal from "../components/transactions/TransactionReviewModal";
import RejectReasonModal from "../components/transactions/RejectReasonModal";
import ImageLightbox from "../components/transactions/ImageLightbox";

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
        .includes(searchQuery.toLowerCase()) ||
      transaction.submittedBy?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.requestedBy?.name
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
        <TransactionStatsCards stats={stats} />

        {/* Filters and Search */}
        <TransactionFilterBar
          filter={filter}
          setFilter={setFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

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
              <TransactionCard
                key={transaction._id}
                transaction={transaction}
                index={index}
                user={user}
                formatDate={formatDate}
                formatAmount={formatAmount}
                getStatusBadge={getStatusBadge}
                isPendingLike={isPendingLike}
                setReviewTx={setReviewTx}
                setRejectModal={setRejectModal}
                setRejectComment={setRejectComment}
                handleApprove={handleApprove}
              />
            ))}
          </div>
        )}
      </div>
      {/* ══════════════════════════════════════════════════════════
           TRANSACTION REVIEW MODAL
      ══════════════════════════════════════════════════════════ */}
      <TransactionReviewModal
        reviewTx={reviewTx}
        setReviewTx={setReviewTx}
        formatDate={formatDate}
        formatAmount={formatAmount}
        getStatusBadge={getStatusBadge}
        isPendingLike={isPendingLike}
        setLightboxUrl={setLightboxUrl}
        setRejectModal={setRejectModal}
        setRejectComment={setRejectComment}
        handleApprove={handleApprove}
      />

      {/* ══════════════════════════════════════════════════════════
           REJECT REASON MODAL
      ══════════════════════════════════════════════════════════ */}
      <RejectReasonModal
        rejectModal={rejectModal}
        setRejectModal={setRejectModal}
        rejectComment={rejectComment}
        setRejectComment={setRejectComment}
        handleReject={handleReject}
      />

      {/* ══════════════════════════════════════════════════════════
           IMAGE LIGHTBOX
      ══════════════════════════════════════════════════════════ */}
      <ImageLightbox
        lightboxUrl={lightboxUrl}
        setLightboxUrl={setLightboxUrl}
      />
    </Layout>
  );
};

export default Transactions;
