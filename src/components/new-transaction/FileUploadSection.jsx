import CameraCapture from "../CameraCapture";

const FileUploadSection = ({
  formData,
  invoiceFile,
  paymentProofFile,
  useCamera,
  setUseCamera,
  handleFileChange,
  handleCameraCapture,
}) => {
  return (
    <div className="mb-6 p-6 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg
          className="w-6 h-6 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Upload Documents
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Invoice Image */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Invoice/Bill Image{" "}
            {formData.hasGSTInvoice && <span className="text-red-500">*</span>}
          </label>

          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setUseCamera({ ...useCamera, invoice: false })}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                !useCamera.invoice
                  ? "bg-[#0077b6] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              📁 Upload File
            </button>
            <button
              type="button"
              onClick={() => setUseCamera({ ...useCamera, invoice: true })}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                useCamera.invoice
                  ? "bg-[#0077b6] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              📸 Use Camera
            </button>
          </div>

          {!useCamera.invoice ? (
            <>
              <input
                type="file"
                id="invoice-file-input"
                onChange={(e) => handleFileChange(e, "invoice")}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300 hover:border-[#0077b6] cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#0077b6] hover:file:bg-blue-100 file:cursor-pointer"
                accept="image/*,.pdf"
                required={formData.hasGSTInvoice && !invoiceFile}
              />
              {invoiceFile && (
                <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
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
                  {invoiceFile.name}
                </p>
              )}
            </>
          ) : (
            <CameraCapture
              onCapture={(file) => handleCameraCapture(file, "invoice")}
              label="Capture Invoice"
            />
          )}
        </div>

        {/* Payment Proof */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Payment Proof <span className="text-red-500">*</span>
          </label>

          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setUseCamera({ ...useCamera, payment: false })}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                !useCamera.payment
                  ? "bg-[#0077b6] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              📁 Upload File
            </button>
            <button
              type="button"
              onClick={() => setUseCamera({ ...useCamera, payment: true })}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                useCamera.payment
                  ? "bg-[#0077b6] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              📸 Use Camera
            </button>
          </div>

          {!useCamera.payment ? (
            <>
              <input
                type="file"
                id="payment-file-input"
                onChange={(e) => handleFileChange(e, "payment")}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300 hover:border-[#0077b6] cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#0077b6] hover:file:bg-blue-100 file:cursor-pointer"
                accept="image/*,.pdf"
                required={!paymentProofFile}
              />
              {paymentProofFile && (
                <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
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
                  {paymentProofFile.name}
                </p>
              )}
            </>
          ) : (
            <CameraCapture
              onCapture={(file) => handleCameraCapture(file, "payment")}
              label="Capture Payment Proof"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadSection;
