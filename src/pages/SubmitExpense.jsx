import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import BasicInfoSection from "../components/submit-expense/BasicInfoSection";
import AmountGSTSection from "../components/submit-expense/AmountGSTSection";
import DocumentUploadSection from "../components/submit-expense/DocumentUploadSection";

const SubmitExpense = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showInvoiceCamera, setShowInvoiceCamera] = useState(false);
  const [showPaymentCamera, setShowPaymentCamera] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    amount: "",
    transactionDate: new Date().toISOString().split("T")[0],
    paymentMethod: "Cash",
    payeeClientName: "",
    purpose: "",
    hasGSTInvoice: false,
    invoiceDate: "",
    preTaxAmount: "",
    taxAmount: "",
    postTaxAmount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [invoiceImage, setInvoiceImage] = useState(null);
  const [paymentProofImage, setPaymentProofImage] = useState(null);
  const [invoicePreview, setInvoicePreview] = useState(null);
  const [paymentPreview, setPaymentPreview] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/categories");
      setCategories(response.data.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleInvoiceChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInvoiceImage(file);
      setInvoicePreview(URL.createObjectURL(file));
      setShowInvoiceCamera(false);
    }
  };

  const handlePaymentProofChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentProofImage(file);
      setPaymentPreview(URL.createObjectURL(file));
      setShowPaymentCamera(false);
    }
  };

  const handleInvoiceCameraCapture = (file) => {
    if (!file) {
      toast.error("Failed to capture image. Please try again.");
      return;
    }
    console.log("Invoice camera captured:", {
      size: file.size,
      type: file.type,
      name: file.name,
    });
    setInvoiceImage(file);
    setInvoicePreview(URL.createObjectURL(file));
    setShowInvoiceCamera(false);
    toast.success("Invoice image added successfully!");
  };

  const handlePaymentCameraCapture = (file) => {
    if (!file) {
      toast.error("Failed to capture image. Please try again.");
      return;
    }
    console.log("Payment camera captured:", {
      size: file.size,
      type: file.type,
      name: file.name,
    });
    setPaymentProofImage(file);
    setPaymentPreview(URL.createObjectURL(file));
    setShowPaymentCamera(false);
    toast.success("Payment proof image added successfully!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();

      // Append form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "" && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      // Append files
      if (invoiceImage) {
        console.log("Appending invoice image:", {
          size: invoiceImage.size,
          type: invoiceImage.type,
        });
        data.append("invoiceImage", invoiceImage);
      } else {
        console.warn("No invoice image provided");
      }

      if (paymentProofImage) {
        console.log("Appending payment proof image:", {
          size: paymentProofImage.size,
          type: paymentProofImage.type,
        });
        data.append("paymentProofImage", paymentProofImage);
      } else {
        console.warn("No payment proof image provided");
      }

      // Log FormData contents
      console.log(
        "FormData being submitted with keys:",
        Array.from(data.keys()),
      );

      const response = await axios.post("/transactions", data);

      setSuccess("Expense submitted successfully!");
      // Dispatch event to notify other components (Reports page) about the new transaction
      window.dispatchEvent(
        new CustomEvent("transactionsUpdated", {
          detail: { action: "created" },
        }),
      );
      setTimeout(() => {
        navigate("/transactions");
      }, 2000);
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.response?.data?.message || "Failed to submit expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white py-6 px-4 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Submit Expense</h1>
            <p className="text-blue-100 mt-2">
              Create a new petty cash expense request
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <BasicInfoSection
            formData={formData}
            handleChange={handleChange}
            categories={categories}
            setFormData={setFormData}
            setCategories={setCategories}
          />

          {/* GST & Amount Details */}
          <AmountGSTSection formData={formData} handleChange={handleChange} />

          {/* File Uploads */}
          <DocumentUploadSection
            invoicePreview={invoicePreview}
            paymentPreview={paymentPreview}
            showInvoiceCamera={showInvoiceCamera}
            showPaymentCamera={showPaymentCamera}
            setShowInvoiceCamera={setShowInvoiceCamera}
            setShowPaymentCamera={setShowPaymentCamera}
            invoiceImage={invoiceImage}
            paymentProofImage={paymentProofImage}
            handleInvoiceChange={handleInvoiceChange}
            handlePaymentProofChange={handlePaymentProofChange}
            handleInvoiceCameraCapture={handleInvoiceCameraCapture}
            handlePaymentCameraCapture={handlePaymentCameraCapture}
            setInvoiceImage={setInvoiceImage}
            setInvoicePreview={setInvoicePreview}
            setPaymentProofImage={setPaymentProofImage}
            setPaymentPreview={setPaymentPreview}
          />

          {/* Additional Notes */}
          <div className="bg-white border border-blue-100 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Additional Notes
            </h2>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any additional information..."
              rows="4"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitExpense;
