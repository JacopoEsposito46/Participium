# WebSocket Client (Frontend)

This module provides WebSocket integration for internal users to receive live updates about report comments.

## Structure

```
src/ws/
├── types.js          # Type definitions and constants
├── socketService.js  # Singleton service for WebSocket management
├── useWebSocket.js   # React hooks for WebSocket integration
└── README.md         # This file
```

## Features

- **Authentication**: JWT-based authentication via handshake
- **Room Management**: Join/leave report-specific rooms
- **Event Handling**: Real-time comment creation notifications
- **React Integration**: Custom hooks for easy component integration
- **Singleton Pattern**: Single connection shared across the app
- **Auto-reconnection**: Configurable reconnection attempts

## Quick Start

### Basic Usage with Hook

```jsx
import { useWebSocket } from "../ws/useWebSocket";
import { useAuth } from "../context/AuthContext";

function ReportDetailPage({ reportId }) {
  const { token } = useAuth();

  const { isConnected, currentReportId } = useWebSocket({
    token,
    reportId,
    onCommentCreated: (comment) => {
      console.log("New comment received:", comment);
    },
    onConnect: () => console.log("WebSocket connected"),
    onDisconnect: () => console.log("WebSocket disconnected"),
    onError: (error) => console.error("WebSocket error:", error),
  });

  return (
    <div>
      <p>Connection: {isConnected ? "Connected" : "Disconnected"}</p>
      <p>Listening to report: {currentReportId}</p>
      {/* component UI */}
    </div>
  );
}
```

### Simplified Hook for Comments Only

```jsx
import { useReportComments } from "../ws/useWebSocket";

function CommentsList({ reportId }) {
  const [comments, setComments] = useState([]);
  const { token } = useAuth();

  const { isConnected, isListening } = useReportComments(
    reportId,
    (newComment) => {
      setComments((prev) => [...prev, newComment]);
    },
    token
  );

  return (
    <div>
      {isListening && <span>Listening for new comments</span>}
      {comments.map((comment) => (
        <div key={comment.id}>{comment.comment}</div>
      ))}
    </div>
  );
}
```

### Manual Control with Service

```jsx
import socketService from "../ws/socketService";
import { WS_EVENTS } from "../ws/types";

// Connect
socketService.connect(token);

// Listen to events
const unsubscribe = socketService.on(WS_EVENTS.COMMENT_CREATED, (comment) => {
  console.log("New comment:", comment);
});

// Join a report room
socketService.joinReport(123);

// Leave a report room
socketService.leaveReport(123);

// Cleanup
unsubscribe();
socketService.disconnect();
```

## API Reference

### `useWebSocket(options)`

Main hook for WebSocket management.

**Options:**

- `token` (string, required): JWT authentication token
- `reportId` (number, optional): Auto-join this report room
- `onCommentCreated` (function, optional): Callback for comment.created events
- `onConnect` (function, optional): Callback when connected
- `onDisconnect` (function, optional): Callback when disconnected
- `onError` (function, optional): Callback for connection errors
- `autoConnect` (boolean, default: true): Auto-connect on mount

**Returns:**

- `isConnected` (boolean): Connection status
- `currentReportId` (number|null): Current report room
- `connect()`: Manually connect
- `disconnect()`: Manually disconnect
- `joinReport(reportId)`: Join a report room
- `leaveReport(reportId)`: Leave a report room

### `useReportComments(reportId, onCommentCreated, token)`

Simplified hook for listening to comments.

**Parameters:**

- `reportId` (number): Report to monitor
- `onCommentCreated` (function): Callback for new comments
- `token` (string): JWT token

**Returns:**

- `isConnected` (boolean): Connection status
- `isListening` (boolean): Whether currently listening to the report

### `socketService`

Singleton service for direct WebSocket control.

**Methods:**

- `connect(token, apiUrl?)`: Initialize connection
- `disconnect()`: Close connection and cleanup
- `joinReport(reportId)`: Join a report room
- `leaveReport(reportId)`: Leave a report room
- `on(event, callback)`: Register event listener
- `off(event, callback)`: Remove event listener
- `getConnectionStatus()`: Get connection status
- `getCurrentReportId()`: Get current report room

### Events (WS_EVENTS)

```javascript
import { WS_EVENTS } from "./types";

WS_EVENTS.COMMENT_CREATED; // 'comment.created'
WS_EVENTS.JOIN_REPORT; // 'join_report'
WS_EVENTS.LEAVE_REPORT; // 'leave_report'
WS_EVENTS.CONNECT; // 'connect'
WS_EVENTS.DISCONNECT; // 'disconnect'
WS_EVENTS.CONNECT_ERROR; // 'connect_error'
```

## Comment Payload Structure

When a `comment.created` event is received:

```javascript
{
  id: number,              // Comment ID
  comment: string,         // Comment text
  commentOwner_id: number, // User ID who created the comment
  creation_date: string,   // ISO timestamp (UTC from DB)
  report_id: number        // Associated report ID
}
```

## Configuration

Edit `WS_CONFIG` in `types.js`:

```javascript
export const WS_CONFIG = {
  NAMESPACE: "/ws/internal",
  AUTO_CONNECT: false,
  RECONNECTION_ATTEMPTS: 5,
  RECONNECTION_DELAY: 1000,
};
```

## Environment Variables

Set in `.env`:

```
VITE_BACKEND_URL=http://localhost:3001
```

## Installation

Install socket.io-client:

```bash
npm install socket.io-client
```

## Best Practices

1. **Token Management**: Ensure token is valid before connecting
2. **Cleanup**: Always disconnect when component unmounts
3. **Room Management**: Leave rooms when navigating away
4. **Error Handling**: Handle connection errors gracefully
5. **State Sync**: Keep local state in sync with WebSocket events

## Troubleshooting

### Connection Issues

- Verify token is valid and user is internal
- Check API URL matches backend server
- Ensure backend WebSocket server is running

### Not Receiving Events

- Verify you've joined the correct report room
- Check reportId is a valid number
- Ensure socket is connected before joining

### Multiple Connections

- The service uses singleton pattern - only one connection per app
- Multiple components can share the same connection
- Each component can join different report rooms

## Example: Complete Report Component

```jsx
import React, { useState, useEffect } from "react";
import { useWebSocket } from "../ws/useWebSocket";
import { useAuth } from "../context/AuthContext";

function ReportPage({ reportId }) {
  const { token } = useAuth();
  const [comments, setComments] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  const { isConnected, currentReportId, joinReport, leaveReport } =
    useWebSocket({
      token,
      reportId, // Auto-join on connect
      onCommentCreated: (newComment) => {
        // Only add if it's for this report
        if (newComment.report_id === reportId) {
          setComments((prev) => [...prev, newComment]);
        }
      },
      onConnect: () => setConnectionStatus("connected"),
      onDisconnect: () => setConnectionStatus("disconnected"),
      onError: (error) => setConnectionStatus(`error: ${error}`),
    });

  // Fetch initial comments
  useEffect(() => {
    async function fetchComments() {
      // Your API call to get existing comments
      const response = await fetch(`/api/reports/${reportId}/comments`);
      const data = await response.json();
      setComments(data);
    }
    fetchComments();
  }, [reportId]);

  // Handle report changes
  useEffect(() => {
    if (isConnected && currentReportId !== reportId) {
      joinReport(reportId);
    }
  }, [reportId, isConnected, currentReportId, joinReport]);

  return (
    <div>
      <h1>Report #{reportId}</h1>
      <p>Status: {connectionStatus}</p>
      {isConnected && currentReportId === reportId && (
        <p>Receiving live updates</p>
      )}

      <div className="comments">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p>{comment.comment}</p>
            <small>
              By user {comment.commentOwner_id} at {comment.creation_date}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReportPage;
```

## Testing

The WebSocket service includes console logging for debugging. Check browser console for:

- `[WebSocket] Connected: <socketId>`
- `[WebSocket] Joined report: <reportId>`
- `[WebSocket] Comment created: <payload>`
- `[WebSocket] Disconnected: <reason>`

## Notes

- Backend uses UTC timestamps; consider localizing on display
- One socket connection is shared across all components
- Room subscriptions are per-socket, not per-component
- Cleanup is automatic when using hooks
