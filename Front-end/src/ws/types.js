/**
 * WebSocket types and interfaces for internal user namespace
 * Namespace: /ws/internal
 */

/**
 * @typedef {Object} CommentCreatedPayload
 * @property {number} id - The comment ID
 * @property {string} comment - The comment text
 * @property {number} commentOwner_id - ID of the comment owner
 * @property {string|Date} creation_date - Comment creation timestamp (UTC)
 * @property {number} report_id - ID of the associated report
 */

/**
 * @typedef {Object} WebSocketConfig
 * @property {string} namespace - WebSocket namespace (default: /ws/internal)
 * @property {boolean} autoConnect - Auto-connect on initialization
 * @property {number} reconnectionAttempts - Max reconnection attempts
 * @property {number} reconnectionDelay - Delay between reconnection attempts (ms)
 */

export const WS_EVENTS = {
  COMMENT_CREATED: "comment.created",
  JOIN_REPORT: "join_report",
  LEAVE_REPORT: "leave_report",
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",
};

export const WS_CONFIG = {
  NAMESPACE: "/ws/internal",
  AUTO_CONNECT: false,
  RECONNECTION_ATTEMPTS: 5,
  RECONNECTION_DELAY: 1000,
};
