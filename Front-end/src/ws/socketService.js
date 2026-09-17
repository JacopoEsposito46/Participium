import { io } from "socket.io-client";
import { WS_CONFIG, WS_EVENTS } from "./types";

/**
 * WebSocket Service for internal users
 * Manages connection to the /ws/internal namespace
 */
class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentReportId = null;
    this.listeners = new Map();
  }

  /**
   * Initialize socket connection with JWT token
   * @param {string} token - JWT token for authentication
   * @param {string} [apiUrl] - Base API URL (default: from env or localhost)
   */
  connect(token, apiUrl) {
    if (this.socket?.connected) {
      console.warn("[WebSocket] Already connected");
      return;
    }

    const resolvedApiUrl =
      apiUrl ??
      import.meta.env.VITE_BACKEND_URL ??
      (typeof window !== "undefined" ? window.location.origin : "");

    console.log(
      "[WebSocket] Connecting to:",
      resolvedApiUrl,
      "with path:",
      WS_CONFIG.NAMESPACE
    );

    this.socket = io(resolvedApiUrl, {
      path: WS_CONFIG.NAMESPACE,
      auth: { token },
      autoConnect: true,
      reconnectionAttempts: WS_CONFIG.RECONNECTION_ATTEMPTS,
      reconnectionDelay: WS_CONFIG.RECONNECTION_DELAY,
      transports: ["websocket", "polling"], // Try WebSocket first, fallback to polling
    });

    this._setupEventHandlers();
  }

  /**
   * Setup internal event handlers
   * @private
   */
  _setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on(WS_EVENTS.CONNECT, () => {
      this.isConnected = true;
      console.log("[WebSocket] Connected:", this.socket.id);
      this._notifyListeners(WS_EVENTS.CONNECT, { socketId: this.socket.id });
    });

    this.socket.on(WS_EVENTS.DISCONNECT, (reason) => {
      this.isConnected = false;
      console.log("[WebSocket] Disconnected:", reason);
      this._notifyListeners(WS_EVENTS.DISCONNECT, { reason });
    });

    this.socket.on(WS_EVENTS.CONNECT_ERROR, (error) => {
      console.error("[WebSocket] Connection error:", error.message);
      this._notifyListeners(WS_EVENTS.CONNECT_ERROR, { error: error.message });
    });

    // Main event: comment created
    this.socket.on(WS_EVENTS.COMMENT_CREATED, (payload) => {
      console.log("[WebSocket] Comment created:", payload);
      this._notifyListeners(WS_EVENTS.COMMENT_CREATED, payload);
    });
  }

  /**
   * Join a report room to receive updates
   * @param {number} reportId - Report ID to join
   */
  joinReport(reportId) {
    if (!this.socket || !this.isConnected) {
      console.warn("[WebSocket] Cannot join report: not connected");
      return;
    }

    const numericReportId = Number(reportId);
    if (!Number.isFinite(numericReportId) || numericReportId <= 0) {
      console.error("[WebSocket] Invalid reportId:", reportId);
      return;
    }

    // Leave current room if exists
    if (this.currentReportId !== null) {
      this.leaveReport(this.currentReportId);
    }

    this.socket.emit(WS_EVENTS.JOIN_REPORT, { reportId: numericReportId });
    this.currentReportId = numericReportId;
    console.log("[WebSocket] Joined report:", numericReportId);
  }

  /**
   * Leave a report room
   * @param {number} reportId - Report ID to leave
   */
  leaveReport(reportId) {
    if (!this.socket || !this.isConnected) {
      return;
    }

    const numericReportId = Number(reportId);
    if (!Number.isFinite(numericReportId) || numericReportId <= 0) {
      return;
    }

    this.socket.emit(WS_EVENTS.LEAVE_REPORT, { reportId: numericReportId });

    if (this.currentReportId === numericReportId) {
      this.currentReportId = null;
    }

    console.log("[WebSocket] Left report:", numericReportId);
  }

  /**
   * Register an event listener
   * @param {string} event - Event name (use WS_EVENTS constants)
   * @param {Function} callback - Callback function
   * @returns {Function} Cleanup function to remove listener
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    // Return cleanup function
    return () => this.off(event, callback);
  }

  /**
   * Remove an event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function to remove
   */
  off(event, callback) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  /**
   * Notify all listeners for an event
   * @private
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  _notifyListeners(event, data) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[WebSocket] Error in listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Disconnect and cleanup
   */
  disconnect() {
    if (this.currentReportId !== null) {
      this.leaveReport(this.currentReportId);
    }

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.close();
      this.socket = null;
    }

    this.isConnected = false;
    this.currentReportId = null;
    this.listeners.clear();
    console.log("[WebSocket] Disconnected and cleaned up");
  }

  /**
   * Check if socket is connected
   * @returns {boolean}
   */
  getConnectionStatus() {
    return this.isConnected;
  }

  /**
   * Get current report room
   * @returns {number|null}
   */
  getCurrentReportId() {
    return this.currentReportId;
  }
}

// Singleton instance
const socketService = new SocketService();

export default socketService;
