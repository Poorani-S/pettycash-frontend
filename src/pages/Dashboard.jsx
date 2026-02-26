import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "../utils/axios";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import DashboardStatsCards from "../components/dashboard/DashboardStatsCards";
import RecentActivity from "../components/dashboard/RecentActivity";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalExpenses: 0,
    pendingCount: 0,
    approvedCount: 0,
    currentBalance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(userData));
    fetchDashboardData();

    // Listen for transaction updates from other pages
    const handleTransactionUpdate = () => {
      fetchDashboardData();
    };

    window.addEventListener("transactionsUpdated", handleTransactionUpdate);

    return () => {
      window.removeEventListener(
        "transactionsUpdated",
        handleTransactionUpdate,
      );
    };
  }, [navigate]);

  const handleClearAllData = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete ALL transactions and fund transfers? This cannot be undone.",
      )
    )
      return;
    try {
      await axios.delete("/transactions/clear-all");
      setRecentTransactions([]);
      setStats({
        totalExpenses: 0,
        pendingCount: 0,
        approvedCount: 0,
        currentBalance: 0,
      });
      window.dispatchEvent(new Event("transactionsUpdated"));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to clear data");
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [financialRes, balanceRes, transactionsRes, fundTransfersRes] =
        await Promise.all([
          axios.get("/reports/financial-summary").catch(() => ({ data: {} })),
          axios
            .get("/fund-transfers/balance/current")
            .catch(() => ({ data: { data: { currentBalance: 0 } } })),
          axios
            .get("/transactions?limit=10")
            .catch(() => ({ data: { data: [] } })),
          axios
            .get("/fund-transfers?limit=10")
            .catch(() => ({ data: { data: [] } })),
        ]);

      const financial = financialRes.data?.data;
      const expenseSummary = financial?.expenseTransactions?.summary || {};
      const fundOverall = financial?.fundTransfers?.overall || {};

      // Get transactions and fund transfers
      const transactions = transactionsRes.data?.data || [];
      const fundTransfers = fundTransfersRes.data?.data || [];

      const combinedTotal =
        (expenseSummary.totalAmount || 0) + (fundOverall.total || 0);

      const pendingCount = expenseSummary.pendingCount || 0;
      const approvedCount =
        (expenseSummary.approvedCount || 0) + (fundOverall.count || 0);

      setStats({
        totalExpenses: combinedTotal,
        pendingCount,
        approvedCount,
        currentBalance: balanceRes.data.data?.currentBalance || 0,
      });

      // Combine and sort recent transactions
      const normalizedTransactions = transactions.map((tx) => ({
        ...tx,
        kind: "transaction",
        displayDate: tx.transactionDate,
        displayAmount: tx.postTaxAmount || tx.amount,
      }));

      const normalizedFundTransfers = fundTransfers.map((ft) => ({
        _id: ft._id,
        kind: "fund_transfer",
        status: "approved",
        description: ft.purpose || ft.notes || "Fund Transfer",
        category: { name: ft.purpose || "Fund Transfer" },
        displayDate: ft.transferDate,
        displayAmount: ft.amount,
        amount: ft.amount,
        transferType: ft.transferType,
      }));

      // Combine and sort by date
      const combined = [...normalizedTransactions, ...normalizedFundTransfers]
        .sort((a, b) => new Date(b.displayDate) - new Date(a.displayDate))
        .slice(0, 5);

      setRecentTransactions(combined);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#023e8a] via-[#0077b6] to-[#0096c7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white font-semibold mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <WelcomeBanner userName={user.name} />
      <DashboardStatsCards stats={stats} />
      <RecentActivity
        user={user}
        loading={loading}
        recentTransactions={recentTransactions}
        onClearAllData={handleClearAllData}
        onViewAll={() => navigate("/transactions")}
      />
    </Layout>
  );
}

export default Dashboard;
