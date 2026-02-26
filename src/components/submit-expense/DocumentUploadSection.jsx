import CameraCapture from "../CameraCapture";

const DocumentUploadSection = ({
  invoicePreview,
  paymentPreview,
  showInvoiceCamera,
  showPaymentCamera,
  setShowInvoiceCamera,
  setShowPaymentCamera,
  invoiceImage,
  paymentProofImage,
  handleInvoiceChange,
  handlePaymentProofChange,
  handleInvoiceCameraCapture,
  handlePaymentCameraCapture,
  setInvoiceImage,
  setInvoicePreview,
  setPaymentProofImage,
  setPaymentPreview,
}) => {
  return (
    <div className="bg-white border border-blue-100 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
          3
        </span>
        Upload Documents
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Invoice Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Invoice/Bill Image
          </label>

          {/* Upload/Camera Buttons */}
          {!invoicePreview && !showInvoiceCamera && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => document.getElementById("invoiceImage").click()}
                className="w-full px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
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
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                📁 Upload File
              </button>
              <button
                type="button"
                onClick={() => setShowInvoiceCamera(true)}
                className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
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
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                📸 Use Camera
              </button>
            </div>
          )}

          {/* Hidden File Input - Support all formats */}
          <input
            type="file"
            id="invoiceImage"
            onChange={handleInvoiceChange}
            accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
            className="hidden"
          />

          {/* Camera Capture Component */}
          {showInvoiceCamera && (
            <div className="space-y-3">
              <CameraCapture
                onCapture={handleInvoiceCameraCapture}
                label="Capture Invoice"
              />
              <button
                type="button"
                onClick={() => setShowInvoiceCamera(false)}
                className="w-full px-4 py-2 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all"
              >
                Cancel Camera
              </button>
            </div>
          )}

          {/* Preview */}
          {invoicePreview && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <div className="relative">
                {invoiceImage?.type?.startsWith("image/") ? (
                  <img
                    src={invoicePreview}
                    alt="Invoice preview"
                    className="max-h-40 mx-auto mb-2 rounded"
                  />
                ) : (
                  <div className="flex flex-col items-center py-4">
                    <svg
                      className="w-12 h-12 text-blue-500 mb-2"
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
                    <p className="text-sm text-gray-600 font-medium">
                      {invoiceImage?.name}
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setInvoiceImage(null);
                    setInvoicePreview(null);
                  }}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-2">
            Supports: Images, PDF, DOC, DOCX, XLS, XLSX, TXT (Max 5MB)
          </p>
        </div>

        {/* Payment Proof Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Payment Proof *
          </label>

          {/* Upload/Camera Buttons */}
          {!paymentPreview && !showPaymentCamera && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() =>
                  document.getElementById("paymentProofImage").click()
                }
                className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
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
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                📁 Upload File
              </button>
              <button
                type="button"
                onClick={() => setShowPaymentCamera(true)}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
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
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                📸 Capture Invoice
              </button>
            </div>
          )}

          {/* Hidden File Input - Support all formats */}
          <input
            type="file"
            id="paymentProofImage"
            onChange={handlePaymentProofChange}
            accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
            className="hidden"
          />

          {/* Camera Capture Component */}
          {showPaymentCamera && (
            <div className="space-y-3">
              <CameraCapture
                onCapture={handlePaymentCameraCapture}
                label="Capture Payment Proof"
              />
              <button
                type="button"
                onClick={() => setShowPaymentCamera(false)}
                className="w-full px-4 py-2 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all"
              >
                Cancel Camera
              </button>
            </div>
          )}

          {/* Preview */}
          {paymentPreview && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <div className="relative">
                {paymentProofImage?.type?.startsWith("image/") ? (
                  <img
                    src={paymentPreview}
                    alt="Payment proof preview"
                    className="max-h-40 mx-auto mb-2 rounded"
                  />
                ) : (
                  <div className="flex flex-col items-center py-4">
                    <svg
                      className="w-12 h-12 text-blue-500 mb-2"
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
                    <p className="text-sm text-gray-600 font-medium">
                      {paymentProofImage?.name}
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentProofImage(null);
                    setPaymentPreview(null);
                  }}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-2">
            Supports: Images, PDF, DOC, DOCX, XLS, XLSX, TXT (Max 5MB)
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadSection;
