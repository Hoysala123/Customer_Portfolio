using Microsoft.Extensions.Logging;

namespace backend.Helpers
{
    /// <summary>
    /// Extension methods for ILogger to provide convenient logging methods
    /// </summary>
    public static class LoggerHelper
    {
        /// <summary>
        /// Log information message
        /// </summary>
        public static void LogInfo<T>(this ILogger<T> logger, string message)
        {
            logger.LogInformation(message);
        }

        /// <summary>
        /// Log error message
        /// </summary>
        public static void LogErr<T>(this ILogger<T> logger, string message)
        {
            logger.LogError(message);
        }

        /// <summary>
        /// Log error message with exception
        /// </summary>
        public static void LogErr<T>(this ILogger<T> logger, Exception ex, string message)
        {
            logger.LogError(ex, message);
        }

        /// <summary>
        /// Log warning message
        /// </summary>
        public static void LogWarn<T>(this ILogger<T> logger, string message)
        {
            logger.LogWarning(message);
        }

        /// <summary>
        /// Log API response information
        /// </summary>
        public static void LogApiResponse<T>(this ILogger<T> logger, string apiPath, string message)
        {
            logger.LogInformation($"[API Response] {apiPath}: {message}");
        }
    }
}
