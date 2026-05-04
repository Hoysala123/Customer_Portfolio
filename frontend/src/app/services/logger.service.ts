import { Injectable } from '@angular/core';

/**
 * Logger service for the frontend application.
 * Provides methods to log messages at different levels (INFO, WARN, ERROR).
 * Logs include timestamp and are stored in browser's localStorage for debugging.
 */
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private logStorageKey = 'app_logs';
  private maxLogs = 500; // Keep last 500 logs in memory

  constructor() {
    this.initializeLogs();
  }

  /**
   * Initialize logs in localStorage if not already present
   */
  private initializeLogs(): void {
    const existingLogs = localStorage.getItem(this.logStorageKey);
    if (!existingLogs) {
      localStorage.setItem(this.logStorageKey, JSON.stringify([]));
    }
  }

  /**
   * Format timestamp as HH:mm:ss.fff
   */
  private getTimestamp(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  /**
   * Store log entry in localStorage
   */
  private storeLog(level: string, message: string, details?: any): void {
    try {
      const timestamp = new Date().toISOString();
      const logEntry = {
        timestamp,
        level,
        message,
        details: details || null,
        userAgent: navigator.userAgent
      };

      const logsJson = localStorage.getItem(this.logStorageKey);
      const logs = logsJson ? JSON.parse(logsJson) : [];

      logs.push(logEntry);

      // Keep only the last maxLogs entries
      if (logs.length > this.maxLogs) {
        logs.shift();
      }

      localStorage.setItem(this.logStorageKey, JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to store log in localStorage', error);
    }
  }

  /**
   * Log an informational message
   * Format: [HH:mm:ss] [INFO] message
   */
  info(message: string, details?: any): void {
    const timestamp = this.getTimestamp();
    const formattedMessage = `[${timestamp}] [INFO] ${message}`;
    console.log(formattedMessage, details || '');
    this.storeLog('INFO', message, details);
  }

  /**
   * Log a warning message
   * Format: [HH:mm:ss] [WARN] message
   */
  warn(message: string, details?: any): void {
    const timestamp = this.getTimestamp();
    const formattedMessage = `[${timestamp}] [WARN] ${message}`;
    console.warn(formattedMessage, details || '');
    this.storeLog('WARN', message, details);
  }

  /**
   * Log an error message
   * Format: [HH:mm:ss] [ERROR] message
   */
  error(message: string, error?: any): void {
    const timestamp = this.getTimestamp();
    const formattedMessage = `[${timestamp}] [ERROR] ${message}`;
    console.error(formattedMessage, error || '');
    this.storeLog('ERROR', message, error ? error.message || error : null);
  }

  /**
   * Log API call with method, endpoint, and userId
   */
  logApiCall(method: string, endpoint: string, userId?: string): void {
    const userInfo = userId ? ` | UserId: ${userId}` : '';
    const message = `API ${method} ${endpoint}${userInfo}`;
    this.info(message);
  }

  /**
   * Log API response with status
   */
  logApiResponse(endpoint: string, status: string): void {
    const message = `${endpoint} response: ${status}`;
    this.info(message);
  }

  /**
   * Log API error response
   */
  logApiError(endpoint: string, statusCode: number, errorMessage: string): void {
    const message = `${endpoint} error [${statusCode}]: ${errorMessage}`;
    this.error(message);
  }

  /**
   * Log authentication event
   */
  logAuthEvent(event: string, username: string, role?: string): void {
    const roleInfo = role ? ` | Role: ${role}` : '';
    const message = `AUTH: ${event} | Username: ${username}${roleInfo}`;
    this.info(message);
  }

  /**
   * Log session timeout
   */
  logSessionTimeout(): void {
    this.warn('Session timed out due to inactivity');
  }

  /**
   * Log token expiration
   */
  logTokenExpired(): void {
    this.warn('JWT token has expired');
  }

  /**
   * Get all stored logs
   */
  getAllLogs(): any[] {
    try {
      const logsJson = localStorage.getItem(this.logStorageKey);
      return logsJson ? JSON.parse(logsJson) : [];
    } catch (error) {
      console.error('Failed to retrieve logs', error);
      return [];
    }
  }

  /**
   * Clear all stored logs
   */
  clearLogs(): void {
    try {
      localStorage.setItem(this.logStorageKey, JSON.stringify([]));
      this.info('All logs cleared');
    } catch (error) {
      console.error('Failed to clear logs', error);
    }
  }

  /**
   * Export logs as JSON file
   */
  exportLogs(): void {
    try {
      const logs = this.getAllLogs();
      const dataStr = JSON.stringify(logs, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `app-logs-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      this.info('Logs exported successfully');
    } catch (error) {
      this.error('Failed to export logs', error);
    }
  }
}
