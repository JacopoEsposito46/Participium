import { useEffect, useRef, useCallback, useState } from "react";
import socketService from "./socketService";
import { WS_EVENTS } from "./types";

/**
 * Custom hook for WebSocket connection management
 * Handles connection lifecycle and report room subscriptions
 *
 * @param {Object} options - Hook options
 * @param {string} options.token - JWT token for authentication
 * @param {number|null} [options.reportId] - Report ID to auto-join (optional)
 * @param {Function} [options.onCommentCreated] - Callback for comment.created event
 * @param {Function} [options.onConnect] - Callback for connection event
 * @param {Function} [options.onDisconnect] - Callback for disconnection event
 * @param {Function} [options.onError] - Callback for connection errors
 * @param {boolean} [options.autoConnect=true] - Auto-connect on mount
 *
 * @returns {Object} WebSocket state and methods
 */
export function useWebSocket({
  token,
  reportId = null,
  onCommentCreated,
  onConnect,
  onDisconnect,
  onError,
  autoConnect = true,
} = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [currentReportId, setCurrentReportId] = useState(null);
  const cleanupRef = useRef([]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (!token) {
      console.warn("[useWebSocket] Cannot connect: missing token");
      return;
    }

    socketService.connect(token);
  }, [token]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    socketService.disconnect();
    setIsConnected(false);
    setCurrentReportId(null);
  }, []);

  // Join a report room
  const joinReport = useCallback((reportIdToJoin) => {
    socketService.joinReport(reportIdToJoin);
    setCurrentReportId(reportIdToJoin);
  }, []);

  // Leave a report room
  const leaveReport = useCallback(
    (reportIdToLeave) => {
      socketService.leaveReport(reportIdToLeave);
      if (currentReportId === reportIdToLeave) {
        setCurrentReportId(null);
      }
    },
    [currentReportId]
  );

  // Setup event listeners
  useEffect(() => {
    const cleanups = [];

    // Connection status listener
    const unsubConnect = socketService.on(WS_EVENTS.CONNECT, (data) => {
      setIsConnected(true);
      onConnect?.(data);
    });
    cleanups.push(unsubConnect);

    const unsubDisconnect = socketService.on(WS_EVENTS.DISCONNECT, (data) => {
      setIsConnected(false);
      setCurrentReportId(null);
      onDisconnect?.(data);
    });
    cleanups.push(unsubDisconnect);

    const unsubError = socketService.on(WS_EVENTS.CONNECT_ERROR, (data) => {
      onError?.(data.error);
    });
    cleanups.push(unsubError);

    // Comment created listener
    if (onCommentCreated) {
      const unsubComment = socketService.on(
        WS_EVENTS.COMMENT_CREATED,
        onCommentCreated
      );
      cleanups.push(unsubComment);
    }

    cleanupRef.current = cleanups;

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [onCommentCreated, onConnect, onDisconnect, onError]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && token) {
      connect();
    }

    return () => {
      if (autoConnect) {
        disconnect();
      }
    };
  }, [autoConnect, token, connect, disconnect]);

  // Auto-join report if reportId is provided
  useEffect(() => {
    if (isConnected && reportId && reportId !== currentReportId) {
      joinReport(reportId);
    }

    return () => {
      if (reportId && currentReportId === reportId) {
        leaveReport(reportId);
      }
    };
  }, [isConnected, reportId, currentReportId, joinReport, leaveReport]);

  return {
    isConnected,
    currentReportId,
    connect,
    disconnect,
    joinReport,
    leaveReport,
  };
}

/**
 * Simpler hook for components that only need to listen to comment events
 * Automatically handles connection and room management
 *
 * @param {number|null} reportId - Report ID to monitor
 * @param {Function} onCommentCreated - Callback when a comment is created
 * @param {string} token - JWT authentication token
 */
export function useReportComments(reportId, onCommentCreated, token) {
  const { isConnected, currentReportId } = useWebSocket({
    token,
    reportId,
    onCommentCreated,
    autoConnect: true,
  });

  return {
    isConnected,
    isListening: currentReportId === reportId,
  };
}

export default useWebSocket;
