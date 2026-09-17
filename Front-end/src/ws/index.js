/**
 * WebSocket module exports
 *
 * Usage:
 * import { useWebSocket, socketService, WS_EVENTS } from './ws';
 */

export { default as socketService } from "./socketService";
export { useWebSocket, useReportComments } from "./useWebSocket";
export { WS_EVENTS, WS_CONFIG } from "./types";
