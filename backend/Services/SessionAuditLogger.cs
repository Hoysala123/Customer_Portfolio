using backend.Helpers;
using Microsoft.Extensions.Logging;

namespace backend.Services
{
    /// <summary>
    /// Service for logging login/logout activities to a file.
    /// Logs are stored in logs/session-audit.log with timestamp and user details.
    /// </summary>
    public interface ISessionAuditLogger
    {
        /// <summary>
        /// Log a successful login event
        /// </summary>
        Task LogLoginAsync(string username, string role, string? ipAddress = null, string? userAgent = null);

        /// <summary>
        /// Log a failed login attempt
        /// </summary>
        Task LogLoginFailureAsync(string username, string reason, string? ipAddress = null);

        /// <summary>
        /// Log a logout event
        /// </summary>
        Task LogLogoutAsync(string userId, string username, string role, string? ipAddress = null);

        /// <summary>
        /// Log a session timeout (inactivity)
        /// </summary>
        Task LogSessionTimeoutAsync(string userId, string username, string role);

        /// <summary>
        /// Log token expiration
        /// </summary>
        Task LogTokenExpiredAsync(string userId, string username, string role);

        /// <summary>
        /// Log multi-device login (previous session invalidation)
        /// </summary>
        Task LogMultiDeviceLoginAsync(string userId, string username, string newDevice);
    }

    /// <summary>
    /// File-based implementation of session audit logging.
    /// Creates a log file in logs/session-audit-YYYY-MM-DD.log
    /// </summary>
    public class SessionAuditLogger : ISessionAuditLogger
    {
        private readonly string _logDirectory = "logs";
        private readonly ILogger<SessionAuditLogger> _logger;

        public SessionAuditLogger(ILogger<SessionAuditLogger> logger)
        {
            _logger = logger;
            // Ensure logs directory exists
            if (!Directory.Exists(_logDirectory))
            {
                Directory.CreateDirectory(_logDirectory);
            }
        }

        /// <summary>
        /// Get the log file path for today's date
        /// </summary>
        private string GetLogFilePath()
        {
            var date = DateTime.Now.ToString("yyyy-MM-dd");
            return Path.Combine(_logDirectory, $"session-audit-{date}.log");
        }

        /// <summary>
        /// Write a log entry to the file
        /// </summary>
        private async Task WriteLogAsync(string logEntry)
        {
            try
            {
                var logFile = GetLogFilePath();
                var timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff");
                var fullEntry = $"[{timestamp}] {logEntry}";

                // Write to file asynchronously
                await File.AppendAllTextAsync(logFile, fullEntry + Environment.NewLine);
            }
            catch (Exception ex)
            {
                _logger.LogErr(ex, $"Failed to write session audit log");
            }
        }

        public async Task LogLoginAsync(string username, string role, string? ipAddress = null, string? userAgent = null)
        {
            var logEntry = $"LOGIN SUCCESS | Username: {username} | Role: {role} | IP: {ipAddress ?? "Unknown"} | UserAgent: {userAgent ?? "Unknown"}";
            await WriteLogAsync(logEntry);
            _logger.LogInfo($"Login logged to file: {username} ({role})");
        }

        public async Task LogLoginFailureAsync(string username, string reason, string? ipAddress = null)
        {
            var logEntry = $"LOGIN FAILURE | Username: {username} | Reason: {reason} | IP: {ipAddress ?? "Unknown"}";
            await WriteLogAsync(logEntry);
            _logger.LogWarn($"Login failure logged: {username} - {reason}");
        }

        public async Task LogLogoutAsync(string userId, string username, string role, string? ipAddress = null)
        {
            var logEntry = $"LOGOUT | UserId: {userId} | Username: {username} | Role: {role} | IP: {ipAddress ?? "Unknown"}";
            await WriteLogAsync(logEntry);
            _logger.LogInfo($"Logout logged to file: {username} ({role})");
        }

        public async Task LogSessionTimeoutAsync(string userId, string username, string role)
        {
            var logEntry = $"SESSION TIMEOUT (INACTIVITY) | UserId: {userId} | Username: {username} | Role: {role}";
            await WriteLogAsync(logEntry);
            _logger.LogInfo($"Session timeout logged: {username}");
        }

        public async Task LogTokenExpiredAsync(string userId, string username, string role)
        {
            var logEntry = $"TOKEN EXPIRED | UserId: {userId} | Username: {username} | Role: {role}";
            await WriteLogAsync(logEntry);
            _logger.LogInfo($"Token expiration logged: {username}");
        }

        public async Task LogMultiDeviceLoginAsync(string userId, string username, string newDevice)
        {
            var logEntry = $"MULTI-DEVICE LOGIN (PREVIOUS SESSION INVALIDATED) | UserId: {userId} | Username: {username} | NewDevice: {newDevice}";
            await WriteLogAsync(logEntry);
            _logger.LogInfo($"Multi-device login logged: {username}");
        }
    }
}
