function HierarchyInfoBox() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-[#0077b6] p-5 rounded-xl mb-6">
      <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
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
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Organization Hierarchy
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👑</span>
          <div>
            <p className="font-semibold text-gray-700">1. Admin/CEO</p>
            <p className="text-xs text-gray-600">
              Full control, creates all users
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">📋</span>
          <div>
            <p className="font-semibold text-gray-700">2. Manager</p>
            <p className="text-xs text-gray-600">Adds employees & interns</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">👤</span>
          <div>
            <p className="font-semibold text-gray-700">3. Employee</p>
            <p className="text-xs text-gray-600">Reports to manager</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <div>
            <p className="font-semibold text-gray-700">4. Intern</p>
            <p className="text-xs text-gray-600">
              Entry-level, reports to manager
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HierarchyInfoBox;
