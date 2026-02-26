const AmountGSTSection = ({ formData, handleChange }) => {
  return (
    <div className="bg-white border border-blue-100 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
          2
        </span>
        Amount & GST Details
      </h2>

      <div className="mb-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="hasGSTInvoice"
            checked={formData.hasGSTInvoice}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-semibold text-gray-700">
            This expense has a GST Invoice
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formData.hasGSTInvoice ? (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pre-Tax Amount (₹) *
              </label>
              <input
                type="number"
                name="preTaxAmount"
                value={formData.preTaxAmount}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Amount before tax"
                step="any"
                required={formData.hasGSTInvoice}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tax Amount (₹) *
              </label>
              <input
                type="number"
                name="taxAmount"
                value={formData.taxAmount}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="GST amount"
                step="any"
                required={formData.hasGSTInvoice}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Post-Tax Amount (₹) *
              </label>
              <input
                type="number"
                name="postTaxAmount"
                value={formData.postTaxAmount}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Total amount"
                step="any"
                required={formData.hasGSTInvoice}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Invoice Date *
              </label>
              <input
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required={formData.hasGSTInvoice}
              />
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amount (₹) *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter amount"
              step="any"
              required={!formData.hasGSTInvoice}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Payment Date *
          </label>
          <input
            type="date"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default AmountGSTSection;
