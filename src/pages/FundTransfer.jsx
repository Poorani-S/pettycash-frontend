import { useState, useEffect } from "react";
import axios from "../utils/axios";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import FundTransferHeader from "../components/fund-transfer/FundTransferHeader";
import FundTransferStats from "../components/fund-transfer/FundTransferStats";
import AddFundsModal from "../components/fund-transfer/AddFundsModal";
import RecentTransactions from "../components/fund-transfer/RecentTransactions";
import AddClientModal from "../components/fund-transfer/AddClientModal";
import ConfirmationModal from "../components/fund-transfer/ConfirmationModal";
import DeleteClientModal from "../components/fund-transfer/DeleteClientModal";

const FundTransfer = () => {
  const [transferType, setTransferType] = useState("bank");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState("1");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [purpose, setPurpose] = useState("");
  const [transferDate, setTransferDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [currentBalance, setCurrentBalance] = useState(0);
  const [fundTransfers, setFundTransfers] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stats, setStats] = useState(null);
  const [userBankDetails, setUserBankDetails] = useState(null);

  // Toggle Add Funds form visibility
  const [showAddFunds, setShowAddFunds] = useState(false);

  // Search for Recent Transactions
  const [ftSearchQuery, setFtSearchQuery] = useState("");

  // Transaction detail view state
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Track source transaction for conversion (expense -> fund transfer)
  const [sourceTransactionId, setSourceTransactionId] = useState(null);
  const [sourceTransactionType, setSourceTransactionType] = useState(null);

  // Client/User states
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedClientDetails, setSelectedClientDetails] = useState(null);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClientLoading, setNewClientLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    action: null,
    message: "",
  });
  const [deleteClientModal, setDeleteClientModal] = useState({
    show: false,
    clientId: null,
    clientName: "",
  });
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
    const initializeData = async () => {
      setInitialLoading(true);
      await fetchCurrentBalance();
      await fetchAllTransactions();
      await fetchStats();
      await loadUserBankDetails();
      await fetchClients();
      setInitialLoading(false);
    };
    initializeData();
  }, []);

  const loadUserBankDetails = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        if (user.bankDetails) {
          setUserBankDetails(user.bankDetails);
          // Pre-fill bank name from user details
          if (user.bankDetails.bankName) {
            setBankName(user.bankDetails.bankName);
          }
        }
      }
    } catch (err) {
      console.error("Error loading user bank details:", err);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get("/clients");
      setClients(response.data.data || []);
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  const handleClientChange = async (e) => {
    const value = e.target.value;
    if (value === "add_new") {
      // Refetch clients to get latest data before showing modal
      await fetchClients();
      setShowAddClientModal(true);
    } else {
      setSelectedClient(value);
      // Set selected client details and pre-fill bank details
      if (value) {
        const client = clients.find((c) => c._id === value);
        setSelectedClientDetails(client || null);
        if (client?.bankDetails) {
          setBankName(client.bankDetails.bankName || "");
          setAccountNumber(client.bankDetails.accountNumber || "");
        } else {
          setBankName("");
          setAccountNumber("");
        }
      } else {
        setSelectedClientDetails(null);
        setBankName("");
        setAccountNumber("");
      }
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    setNewClientLoading(true);
    try {
      const response = await axios.post("/clients", newClient);
      const addedClient = response.data.data;
      // Refetch to ensure we have the latest client list
      await fetchClients();
      setSelectedClient(addedClient._id);
      setSelectedClientDetails(addedClient);
      setShowAddClientModal(false);
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
      // Pre-fill bank details
      if (addedClient.bankDetails) {
        setBankName(addedClient.bankDetails.bankName || "");
        setAccountNumber(addedClient.bankDetails.accountNumber || "");
      }
      toast.success(`Client "${addedClient.name}" added successfully!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add client");
    } finally {
      setNewClientLoading(false);
    }
  };

  const handleDeleteClient = async () => {
    try {
      const response = await axios.delete(
        `/clients/${deleteClientModal.clientId}`,
      );
      if (response.data.success) {
        // Refetch to ensure we have the latest client list
        await fetchClients();
        if (selectedClient === deleteClientModal.clientId) {
          setSelectedClient("");
          setSelectedClientDetails(null);
          setBankName("");
          setAccountNumber("");
        }
        toast.success(
          `User "${deleteClientModal.clientName}" deleted successfully!`,
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleteClientModal({ show: false, clientId: null, clientName: "" });
    }
  };

  const fetchCurrentBalance = async () => {
    try {
      const response = await axios.get("/fund-transfers/balance/current");
      setCurrentBalance(response.data.data.currentBalance);
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  const fetchFundTransfers = async () => {
    try {
      const response = await axios.get("/fund-transfers?limit=20");
      setFundTransfers(response.data.data || []);
    } catch (err) {
      console.error("Error fetching fund transfers:", err);
    }
  };

  const fetchAllTransactions = async () => {
    try {
      // Fetch both fund transfers and expense transactions with error handling
      let fundTransfersData = [];
      let expenseTransactionsData = [];

      try {
        const fundTransfersRes = await axios.get("/fund-transfers?limit=50");
        fundTransfersData = (fundTransfersRes.data.data || []).map((ft) => ({
          ...ft,
          transactionType: "fund_transfer",
          displayDate: ft.transferDate,
          displayAmount: ft.amount,
          isCredit: true,
        }));
        setFundTransfers(fundTransfersRes.data.data || []);
      } catch (err) {
        console.error("Error fetching fund transfers:", err);
      }

      try {
        const expenseTransactionsRes = await axios.get(
          "/transactions?limit=50",
        );
        expenseTransactionsData = (expenseTransactionsRes.data.data || []).map(
          (et) => ({
            ...et,
            transactionType: "expense",
            displayDate: et.date || et.createdAt,
            displayAmount:
              et.postTaxAmount || et.preTaxAmount || et.amount || 0,
            isCredit: false,
          }),
        );
      } catch (err) {
        console.error("Error fetching expense transactions:", err);
      }

      // Combine and sort by date (newest first)
      const combined = [...fundTransfersData, ...expenseTransactionsData].sort(
        (a, b) => new Date(b.displayDate) - new Date(a.displayDate),
      );

      setAllTransactions(combined);
    } catch (err) {
      console.error("Error fetching all transactions:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get("/fund-transfers/stats/summary");
      setStats(response.data.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleClearHistory = async () => {
    setConfirmModal({
      show: true,
      action: "clearHistory",
      message:
        "Are you sure you want to clear all fund transfer history? This action cannot be undone.",
    });
  };

  const executeClearHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.delete("/fund-transfers/clear-history");
      toast.success(
        `${response.data.deletedCount} fund transfer record(s) cleared successfully!`,
      );
      setAllTransactions([]);
      fetchStats(); // Refresh stats
    } catch (err) {
      console.error("Error clearing history:", err);
      toast.error(err.response?.data?.message || "Failed to clear history");
    } finally {
      setLoading(false);
    }
  };

  const handlePopulateFromTransaction = (transaction) => {
    // Set the selected transaction for detail view
    setSelectedTransaction(transaction);

    // Open the Add Funds form
    setShowAddFunds(true);

    // Track source transaction for potential conversion
    setSourceTransactionId(transaction._id);
    setSourceTransactionType(transaction.transactionType);

    // Populate form based on transaction type
    if (transaction.transactionType === "fund_transfer") {
      // Fund Transfer - populate with fund transfer details
      setTransferType(
        transaction.transferType === "Bank Transfer" ||
          transaction.transferType === "bank"
          ? "bank"
          : "cash",
      );
      setAmount(transaction.amount?.toString() || "");
      setCurrency(transaction.currency || "INR");
      setExchangeRate(transaction.exchangeRate?.toString() || "1");
      setPurpose(transaction.purpose || transaction.notes || "");

      // Set recipient if available
      if (transaction.recipientId?._id) {
        setSelectedClient(transaction.recipientId._id);
        setSelectedClientDetails(transaction.recipientId);
      }

      // Set bank details for bank transfers
      if (
        transaction.transferType === "bank" ||
        transaction.transferType === "Bank Transfer"
      ) {
        setBankName(transaction.bankName || "");
        setAccountNumber(transaction.accountNumber || "");
        setTransactionId(transaction.transactionReference || "");
      }
    } else {
      // Expense Transaction - convert to cash fund transfer
      setTransferType("cash");
      setAmount(
        transaction.displayAmount?.toString() ||
          transaction.postTaxAmount?.toString() ||
          transaction.amount?.toString() ||
          "",
      );
      setCurrency(transaction.currency || "INR");
      setExchangeRate(transaction.exchangeRate?.toString() || "1");
      setPurpose(
        `Replenish: ${transaction.category?.name || "Expense"} - ${transaction.payeeClientName || ""}`,
      );

      // Auto-populate user from expense transaction
      if (transaction.submittedBy?._id) {
        setSelectedClient(transaction.submittedBy._id);
        setSelectedClientDetails(transaction.submittedBy);
      } else if (transaction.user?._id) {
        setSelectedClient(transaction.user._id);
        setSelectedClientDetails(transaction.user);
      } else if (transaction.requestedBy?._id) {
        setSelectedClient(transaction.requestedBy._id);
        setSelectedClientDetails(transaction.requestedBy);
      }

      // Clear bank details for cash
      setBankName("");
      setAccountNumber("");
      setTransactionId("");
    }

    // Reset other fields
    setRemarks(
      `Copied from transaction on ${formatDateTime(transaction.displayDate)}`,
    );
    setTransferDate(new Date().toISOString().split("T")[0]);

    // Show success message
    toast.info(
      "✅ Form populated! Review and modify as needed before submitting.",
      {
        autoClose: 3000,
      },
    );

    // Scroll to form
    setTimeout(() => {
      const formElement = document.querySelector("form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // If converting from expense, delete it first and preserve timestamp
      let conversionSuccess = false;
      let originalTimestamp = null;

      if (sourceTransactionType === "expense" && sourceTransactionId) {
        try {
          // Get the original transaction to preserve its timestamp
          if (selectedTransaction) {
            originalTimestamp = selectedTransaction.createdAt;
          }
          await axios.delete(`/transactions/${sourceTransactionId}`);
          conversionSuccess = true;
        } catch (deleteErr) {
          console.error("Error deleting source expense:", deleteErr);
          // Don't fail the whole operation if delete fails
        }
      }

      const data = {
        transferType,
        amount: parseFloat(amount),
        currency,
        exchangeRate: parseFloat(exchangeRate),
        transferDate,
        remarks,
        purpose,
        clientId: selectedClient || undefined,
      };

      if (transferType === "bank") {
        data.bankName = bankName;
        data.accountNumber = accountNumber;
        data.transactionId = transactionId;
      }

      // If converting, preserve original timestamp for sorting
      if (conversionSuccess && originalTimestamp) {
        data.preserveTimestamp = originalTimestamp;
      }

      const response = await axios.post("/fund-transfers", data);

      // Immediately update UI if conversion was successful
      if (conversionSuccess && sourceTransactionId) {
        // Remove the expense from the list immediately
        setAllTransactions((prevTransactions) =>
          prevTransactions.filter((t) => t._id !== sourceTransactionId),
        );

        // Add a temporary placeholder for the new fund transfer
        const newFundTransfer = {
          _id: response.data.data._id,
          transactionType: "fund_transfer",
          amount: parseFloat(amount),
          displayAmount: parseFloat(amount),
          transferType: transferType,
          purpose: purpose,
          recipientId: selectedClientDetails,
          initiatedBy: { name: response.data.data.initiatedBy?.name || "You" },
          transferDate: transferDate,
          displayDate: originalTimestamp || response.data.data.createdAt,
          createdAt: originalTimestamp || response.data.data.createdAt,
          isCredit: true,
          bankName: transferType === "bank" ? bankName : undefined,
          transactionReference:
            transferType === "bank" ? transactionId : undefined,
        };

        // Add the new fund transfer and re-sort
        setAllTransactions((prevTransactions) => {
          const updated = [...prevTransactions, newFundTransfer];
          return updated.sort(
            (a, b) =>
              new Date(b.displayDate || b.createdAt) -
              new Date(a.displayDate || a.createdAt),
          );
        });
      }

      const successMsg = conversionSuccess
        ? "✅ Expense converted to fund transfer successfully!"
        : "Funds added successfully!";
      setSuccess(successMsg);
      setCurrentBalance(response.data.balance);

      // Auto-hide success message after 4 seconds
      setTimeout(() => setSuccess(""), 4000);

      // Close the Add Funds form after successful submission
      setShowAddFunds(false);

      // Dispatch event to notify other components about the update
      window.dispatchEvent(
        new CustomEvent("transactionsUpdated", {
          detail: {
            action: conversionSuccess
              ? "expenseConverted"
              : "fundTransferCreated",
          },
        }),
      );

      // Reset form - keep bank name pre-filled from user profile
      setAmount("");
      setCurrency("INR");
      setExchangeRate("1");
      setAccountNumber("");
      setTransactionId("");
      setRemarks("");
      setPurpose("");
      setSelectedClient("");
      setSelectedClientDetails(null);
      setSelectedTransaction(null);
      setSourceTransactionId(null);
      setSourceTransactionType(null);
      setTransferDate(new Date().toISOString().split("T")[0]);
      // Keep bankName from user profile
      if (userBankDetails?.bankName) {
        setBankName(userBankDetails.bankName);
      } else {
        setBankName("");
      }

      // Refresh data
      await fetchAllTransactions();
      await fetchStats();

      // Ensure selected transaction is cleared for UI update
      setSelectedTransaction(null);

      // Show toast notification for conversion
      if (conversionSuccess) {
        toast.success("💰 Expense converted to fund transfer!", {
          autoClose: 3000,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add funds");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Layout>
      {/* Initial Loading Loader */}
      {initialLoading && (
        <Loader
          fullScreen={true}
          message="Loading fund transfer data..."
          size="large"
        />
      )}

      {!initialLoading && (
        <>
          {/* Header Banner */}
          <FundTransferHeader />

          {/* Statistics Cards */}
          {stats && <FundTransferStats stats={stats} />}

          {/* Add Funds Toggle Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddFunds(true)}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#023e8a] to-[#0077b6] hover:from-[#0077b6] hover:to-[#00b4d8] text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1.5">
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
              </div>
              Add Funds
            </button>
          </div>

          {/* Add Funds Modal */}
          {showAddFunds && (
            <AddFundsModal
              setShowAddFunds={setShowAddFunds}
              selectedTransaction={selectedTransaction}
              setSelectedTransaction={setSelectedTransaction}
              sourceTransactionType={sourceTransactionType}
              setSourceTransactionId={setSourceTransactionId}
              setSourceTransactionType={setSourceTransactionType}
              error={error}
              handleSubmit={handleSubmit}
              selectedClient={selectedClient}
              setSelectedClient={setSelectedClient}
              handleClientChange={handleClientChange}
              clients={clients}
              selectedClientDetails={selectedClientDetails}
              setSelectedClientDetails={setSelectedClientDetails}
              setDeleteClientModal={setDeleteClientModal}
              transferType={transferType}
              setTransferType={setTransferType}
              currency={currency}
              setCurrency={setCurrency}
              exchangeRate={exchangeRate}
              setExchangeRate={setExchangeRate}
              amount={amount}
              setAmount={setAmount}
              purpose={purpose}
              setPurpose={setPurpose}
              transferDate={transferDate}
              setTransferDate={setTransferDate}
              bankName={bankName}
              setBankName={setBankName}
              accountNumber={accountNumber}
              setAccountNumber={setAccountNumber}
              transactionId={transactionId}
              setTransactionId={setTransactionId}
              remarks={remarks}
              setRemarks={setRemarks}
              loading={loading}
              userBankDetails={userBankDetails}
            />
          )}

          {/* Recent Transactions */}
          <RecentTransactions
            allTransactions={allTransactions}
            ftSearchQuery={ftSearchQuery}
            setFtSearchQuery={setFtSearchQuery}
            selectedTransaction={selectedTransaction}
            setSelectedTransaction={setSelectedTransaction}
            handlePopulateFromTransaction={handlePopulateFromTransaction}
            handleClearHistory={handleClearHistory}
            formatDateTime={formatDateTime}
          />

          {/* Success Message - Fixed Bottom Toast */}
          {success && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-slideInUp">
              <div className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]">
                <svg
                  className="w-5 h-5 flex-shrink-0"
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
                <span className="font-semibold">{success}</span>
                <button
                  onClick={() => setSuccess("")}
                  className="ml-auto text-white/80 hover:text-white transition-colors"
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
                </button>
              </div>
            </div>
          )}

          {/* Add New User Modal */}
          {showAddClientModal && (
            <AddClientModal
              setShowAddClientModal={setShowAddClientModal}
              handleAddClient={handleAddClient}
              newClient={newClient}
              setNewClient={setNewClient}
              newClientLoading={newClientLoading}
            />
          )}

          {/* Confirmation Modal */}
          {confirmModal.show && (
            <ConfirmationModal
              confirmModal={confirmModal}
              setConfirmModal={setConfirmModal}
              executeClearHistory={executeClearHistory}
            />
          )}

          {/* Delete Client Confirmation Modal */}
          {deleteClientModal.show && (
            <DeleteClientModal
              deleteClientModal={deleteClientModal}
              setDeleteClientModal={setDeleteClientModal}
              handleDeleteClient={handleDeleteClient}
            />
          )}
        </>
      )}
    </Layout>
  );
};

export default FundTransfer;
