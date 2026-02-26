function ActivityHistoryPanel({
  activityLogs,
  loadingActivity,
  exportActivityPDF,
  handleClearAllActivityLogs,
  handleDeleteUserFromLog,
  handleDeleteActivityLog,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <svg
            className="w-6 h-6 text-[#0077b6]"
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
          User Management Activity Log
        </h2>
        <div className="flex gap-2">
          <button
            onClick={exportActivityPDF}
            disabled={loadingActivity || activityLogs.length === 0}
            className="px-4 py-2 bg-[#0077b6] text-white rounded-lg hover:bg-[#023e8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            title="Export PDF"
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
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            PDF
          </button>
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to clear all activity history? This action cannot be undone.",
                )
              ) {
                handleClearAllActivityLogs();
              }
            }}
            disabled={loadingActivity || activityLogs.length === 0}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            title="Clear All History"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Clear All
          </button>
        </div>
      </div>

      {loadingActivity ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-[#0077b6] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading activity...</p>
        </div>
      ) : activityLogs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-300"
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
          No activity logs found
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {activityLogs.map((log, index) => (
            <div
              key={log._id}
              className="p-4 bg-gray-50 rounded-xl border-l-4 border-[#0077b6] hover:shadow-md transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      log.action === "created"
                        ? "bg-green-100 text-green-700"
                        : log.action === "updated"
                          ? "bg-blue-100 text-blue-700"
                          : log.action === "deleted"
                            ? "bg-red-100 text-red-700"
                            : log.action === "deactivated"
                              ? "bg-yellow-100 text-yellow-700"
                              : log.action === "reactivated"
                                ? "bg-cyan-100 text-cyan-700"
                                : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {log.action?.toUpperCase()}
                  </span>
                  {log.targetUser?._id && log.action !== "deleted" && (
                    <button
                      onClick={() =>
                        handleDeleteUserFromLog(
                          log.targetUser._id,
                          log.targetUser.name,
                        )
                      }
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete this user"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">
                    {new Date(log.createdAt).toLocaleString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this activity log entry? This action cannot be undone.",
                        )
                      ) {
                        handleDeleteActivityLog(log._id);
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete this activity log entry"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="font-medium text-gray-800">
                <span className="text-[#0077b6]">
                  {log.performedBy?.name || "System"}
                </span>{" "}
                {log.action}{" "}
                <span className="text-[#023e8a]">
                  {log.targetUser?.name ||
                    log.details?.targetUserName ||
                    "Unknown User"}
                </span>
              </p>
              {log.details?.changes && (
                <p className="text-sm text-gray-600 mt-1">
                  Changes: {log.details.changes.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityHistoryPanel;
