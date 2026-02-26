import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import NewTransactionHeader from "../components/new-transaction/NewTransactionHeader";
import AlertBanners from "../components/new-transaction/AlertBanners";
import CategorySection from "../components/new-transaction/CategorySection";
import ClientSection from "../components/new-transaction/ClientSection";
import AmountSection from "../components/new-transaction/AmountSection";
import BankDetailsSection from "../components/new-transaction/BankDetailsSection";
import FileUploadSection from "../components/new-transaction/FileUploadSection";
import DeleteConfirmModal from "../components/new-transaction/DeleteConfirmModal";

const NewTransaction = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAddClient, setShowAddClient] = useState(false);
  const [userBankDetails, setUserBankDetails] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    clientId: null,
    clientName: "",
  });

  const [formData, setFormData] = useState({
    category: "",
    hasGSTInvoice: false,
    invoiceDate: new Date().toISOString().split("T")[0],
    payeeClientName: "",
    clientId: "",
    purpose: "",
    preTaxAmount: "",
    taxAmount: "",
    postTaxAmount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMode: "cash",
    transactionId: "",
    accountNumber: "",
  });

  const [newClient, setNewClient] = useState({
    name: "",
    gstNumber: "",
    email: "",
    phone: "",
    supplyType: "",
    category: "vendor",
    address: "",
  });

  const [invoiceFile, setInvoiceFile] = useState(null);
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [useCamera, setUseCamera] = useState({
    invoice: false,
    payment: false,
  });

  useEffect(() => {
    fetchCategories();
    fetchClients();
    fetchUserBankDetails();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/categories");
      setCategories(response.data.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
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

  const fetchUserBankDetails = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        if (user.bankDetails) {
          setUserBankDetails(user.bankDetails);
        }
      }
    } catch (err) {
      console.error("Error fetching user bank details:", err);
    }
  };

  const handleClientSelect = async (clientId) => {
    if (clientId === "add_new") {
      // Refetch clients to get latest data before showing modal
      await fetchClients();
      setShowAddClient(true);
      setFormData((prev) => ({ ...prev, clientId: "", payeeClientName: "" }));
    } else if (clientId) {
      const selectedClient = clients.find((c) => c._id === clientId);
      if (selectedClient) {
        setFormData((prev) => ({
          ...prev,
          clientId: clientId,
          payeeClientName: selectedClient.name,
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, clientId: "", payeeClientName: "" }));
    }
  };

  const handleAddClient = async () => {
    try {
      if (!newClient.name.trim()) {
        toast.error("Client name is required");
        return;
      }
      const response = await axios.post("/clients", newClient);
      if (response.data.success) {
        const addedClient = response.data.data;
        // Refetch to ensure we have the latest client list
        await fetchClients();
        setFormData((prev) => ({
          ...prev,
          clientId: addedClient._id,
          payeeClientName: addedClient.name,
        }));
        setShowAddClient(false);
        setNewClient({
          name: "",
          gstNumber: "",
          email: "",
          phone: "",
          supplyType: "",
          category: "vendor",
          address: "",
        });
        toast.success(`Client "${addedClient.name}" added successfully!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add client");
    }
  };

  const handleDeleteClient = async () => {
    try {
      const response = await axios.delete(`/clients/${deleteConfirm.clientId}`);
      if (response.data.success) {
        // Refetch to ensure we have the latest client list
        await fetchClients();
        if (formData.clientId === deleteConfirm.clientId) {
          setFormData((prev) => ({
            ...prev,
            clientId: "",
            payeeClientName: "",
          }));
        }
        toast.success(
          `Client "${deleteConfirm.clientName}" deleted successfully!`,
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete client");
    } finally {
      setDeleteConfirm({ show: false, clientId: null, clientName: "" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAmountChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    const updatedData = { ...formData, [field]: value };

    // Auto-calculate postTaxAmount if preTax and tax are available
    if (field === "preTaxAmount" || field === "taxAmount") {
      const preTax =
        field === "preTaxAmount"
          ? numValue
          : parseFloat(formData.preTaxAmount) || 0;
      const tax =
        field === "taxAmount" ? numValue : parseFloat(formData.taxAmount) || 0;
      updatedData.postTaxAmount = (preTax + tax).toFixed(2);
    }

    setFormData(updatedData);
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "invoice") {
      setInvoiceFile(file);
      setUseCamera({ ...useCamera, invoice: false });
    } else {
      setPaymentProofFile(file);
      setUseCamera({ ...useCamera, payment: false });
    }
  };

  const handleCameraCapture = (file, type) => {
    if (type === "invoice") {
      setInvoiceFile(file);
      // Switch back to file-view so the captured file name is shown
      setUseCamera((prev) => ({ ...prev, invoice: false }));
    } else {
      setPaymentProofFile(file);
      setUseCamera((prev) => ({ ...prev, payment: false }));
    }
  };

  const validateForm = () => {
    const errors = [];
    const warns = [];

    // Validate mandatory fields
    if (!formData.category) errors.push("Category is required");
    if (!formData.payeeClientName.trim())
      errors.push("Payee/Client name is required");
    if (!formData.purpose.trim())
      errors.push("Purpose/Description is required");

    // Validate numeric fields are non-negative
    const preTax = parseFloat(formData.preTaxAmount) || 0;
    const tax = parseFloat(formData.taxAmount) || 0;
    const postTax = parseFloat(formData.postTaxAmount) || 0;

    if (preTax < 0) errors.push("Pre-tax amount cannot be negative");
    if (tax < 0) errors.push("Tax amount cannot be negative");
    if (postTax < 0) errors.push("Total amount cannot be negative");
    if (preTax === 0) errors.push("Pre-tax amount must be greater than 0");

    // Validate total equals pre-tax + tax
    const expectedTotal = preTax + tax;
    if (Math.abs(expectedTotal - postTax) > 0.01) {
      errors.push(
        `Total amount (₹${postTax.toFixed(2)}) must equal Pre-tax (₹${preTax.toFixed(2)}) + Tax (₹${tax.toFixed(2)}) = ₹${expectedTotal.toFixed(2)}`,
      );
    }

    // Highlight missing attachments
    if (formData.hasGSTInvoice && !invoiceFile) {
      errors.push("Invoice image is required when GST invoice is selected");
    }
    if (!paymentProofFile) {
      errors.push("Payment proof is required");
    }

    // Warnings for optional but recommended fields
    if (!invoiceFile && !formData.hasGSTInvoice) {
      warns.push(
        "Consider uploading an invoice image for better record keeping",
      );
    }

    setValidationErrors(errors);
    setWarnings(warns);
    return errors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run validation
    if (!validateForm()) {
      setError("Please fix the validation errors before submitting");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setValidationErrors([]);
    setWarnings([]);

    try {
      const formDataToSend = new FormData();

      // Append all text fields
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Append files
      if (invoiceFile) {
        formDataToSend.append("invoiceImage", invoiceFile);
      }
      if (paymentProofFile) {
        formDataToSend.append("paymentProofImage", paymentProofFile);
      }

      const response = await axios.post("/transactions", formDataToSend);

      setSuccess(
        "Transaction submitted successfully! Waiting for admin approval.",
      );

      // Dispatch event to notify other components (Reports page) about the new transaction
      window.dispatchEvent(
        new CustomEvent("transactionsUpdated", {
          detail: { action: "created" },
        }),
      );

      // Reset form after 2 seconds
      setTimeout(() => {
        navigate("/transactions");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <NewTransactionHeader />

      <AlertBanners
        validationErrors={validationErrors}
        warnings={warnings}
        error={error}
        success={success}
      />

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl sm:rounded-2xl shadow-soft p-4 sm:p-6 md:p-8 animate-slideInUp"
        style={{ animationDelay: "100ms" }}
      >
        {/* Form Title */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <svg
              className="w-7 h-7 text-[#0077b6]"
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
            Expense Details
          </h2>
          <p className="text-gray-600 mt-2">
            Please provide accurate information for quick approval
          </p>
        </div>

        <CategorySection
          formData={formData}
          handleInputChange={handleInputChange}
          categories={categories}
        />

        <ClientSection
          formData={formData}
          handleInputChange={handleInputChange}
          handleClientSelect={handleClientSelect}
          clients={clients}
          setDeleteConfirm={setDeleteConfirm}
          showAddClient={showAddClient}
          setShowAddClient={setShowAddClient}
          newClient={newClient}
          setNewClient={setNewClient}
          handleAddClient={handleAddClient}
        />

        {/* Purpose */}
        <div className="mb-6">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Purpose/Description *
          </label>
          <textarea
            name="purpose"
            value={formData.purpose}
            onChange={handleInputChange}
            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300 hover:border-[#0077b6]"
            placeholder="Provide a detailed description of the expense..."
            rows="4"
            required
          />
        </div>

        <AmountSection
          formData={formData}
          handleInputChange={handleInputChange}
          handleAmountChange={handleAmountChange}
        />

        {/* Bank Details Section - Shows for bank/UPI payments */}
        {["bank_transfer", "upi", "gpay", "paytm"].includes(
          formData.paymentMode,
        ) && (
          <BankDetailsSection
            formData={formData}
            handleInputChange={handleInputChange}
            userBankDetails={userBankDetails}
          />
        )}

        <FileUploadSection
          formData={formData}
          invoiceFile={invoiceFile}
          paymentProofFile={paymentProofFile}
          useCamera={useCamera}
          setUseCamera={setUseCamera}
          handleFileChange={handleFileChange}
          handleCameraCapture={handleCameraCapture}
        />

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate("/transactions")}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold flex items-center gap-2"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-[#023e8a] to-[#0077b6] text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              <>
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Submit Expense
              </>
            )}
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <DeleteConfirmModal
          deleteConfirm={deleteConfirm}
          setDeleteConfirm={setDeleteConfirm}
          handleDeleteClient={handleDeleteClient}
        />
      )}
    </Layout>
  );
};

export default NewTransaction;
