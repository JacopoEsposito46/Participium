/**
 * WebSocket Smoke Test Script
 *
 * This script allows testing the WebSocket connection from Node.js
 * without using the React interface.
 *
 * Usage:
 * node scripts/ws-test.js <TOKEN> <REPORT_ID>
 *
 * Example:
 * node scripts/ws-test.js "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." 123
 */

import { io } from "socket.io-client";

// Configuration
const API_BASE_URL = process.env.VITE_BACKEND_URL || "http://localhost:3001";
const WS_NAMESPACE = "/ws/internal";

// Command line parameters
const [, , token, reportIdArg] = process.argv;

if (!token || !reportIdArg) {
  console.error("Error: Token and reportId are required");
  console.log("\nUsage: node scripts/ws-test.js <TOKEN> <REPORT_ID>");
  console.log("\nExample:");
  console.log('  node scripts/ws-test.js "your-jwt-token" 123');
  process.exit(1);
}

const reportId = parseInt(reportIdArg, 10);
if (isNaN(reportId) || reportId <= 0) {
  console.error("Error: reportId must be a positive number");
  process.exit(1);
}

console.log("WebSocket Test Script");
console.log("====================");
console.log(`Server: ${API_BASE_URL}`);
console.log(`Namespace: ${WS_NAMESPACE}`);
console.log(`Report ID: ${reportId}`);
console.log("");

// Create connection
const socketUrl = `${API_BASE_URL}${WS_NAMESPACE}`;
console.log(`Connecting to: ${socketUrl}`);

const socket = io(socketUrl, {
  auth: { token },
  autoConnect: true,
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
});

// Event handlers
socket.on("connect", () => {
  console.log(`Connected. Socket ID: ${socket.id}`);
  console.log(`Joining report room: ${reportId}`);
  socket.emit("join_report", { reportId });
  console.log("");
  console.log("Listening for events...");
  console.log("   (Press Ctrl+C to exit)");
  console.log("");
});

socket.on("disconnect", (reason) => {
  console.log(`Disconnected: ${reason}`);
});

socket.on("connect_error", (error) => {
  console.error(`Connection error: ${error.message}`);
  process.exit(1);
});

socket.on("comment.created", (payload) => {
  console.log("COMMENT CREATED");
  console.log("-------------------------------");
  console.log(JSON.stringify(payload, null, 2));
  console.log("-------------------------------");
  console.log("");
});

// Cleanup on exit
process.on("SIGINT", () => {
  console.log("\n\nClosing connection...");
  socket.emit("leave_report", { reportId });
  socket.close();
  console.log("Done.");
  process.exit(0);
});

// Keep script running
process.stdin.resume();
