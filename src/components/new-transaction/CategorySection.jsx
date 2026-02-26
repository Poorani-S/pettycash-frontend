const CategorySection = ({ formData, handleInputChange, categories }) => {
  return (
    <>
      {/* Category */}
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
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          Expense Category *
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0077b6] focus:border-[#0077b6] transition-all duration-300 text-gray-700 font-medium hover:border-[#0077b6]"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name} ({cat.code})
            </option>
          ))}
        </select>
      </div>

      {/* GST Invoice Toggle */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="hasGSTInvoice"
            checked={formData.hasGSTInvoice}
            onChange={handleInputChange}
            className="w-6 h-6 text-[#0077b6] border-gray-300 rounded-lg focus:ring-[#0077b6] cursor-pointer"
          />
          <div>
            <span className="text-sm font-bold text-gray-700 group-hover:text-[#0077b6] transition-colors">
              This expense has a GST Invoice
            </span>
            <p className="text-xs text-gray-500 mt-0.5">
              Check if GST is applicable to this transaction
            </p>
          </div>
        </label>
      </div>
    </>
  );
};

export default CategorySection;
