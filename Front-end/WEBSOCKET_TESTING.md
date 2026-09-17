# WebSocket Testing Guide

This guide helps you test the WebSocket connection in the frontend.

## Prerequisites

1. Backend is running with the WebSocket namespace enabled
2. You have an internal user (employee) account for authentication
3. A valid report ID exists in the database

## Test Methods

### Method 1: UI Test Component (Recommended)

The simplest way to test is using the provided UI test component.

#### Steps

1. Start the frontend:

   ```bash
   npm run dev
   ```

2. Log in as an internal user (employee)

3. Open the test page:

   ```
   http://localhost:5173/ws-test
   ```

4. Test the connection:
   - The token is automatically loaded from localStorage
   - Click "Connect" to establish the connection
   - The status should change to "CONNECTED"

5. Join a report room:
   - Enter a valid reportId (e.g., 1, 2, 123)
   - Click "Join Report"
   - The "Current Room" value will update

6. Verify event reception:
   - From the backend or Postman, create a comment for that report
   - The `COMMENT_CREATED` event should appear in the event log

#### What to observe

- Status badge: should be green when connected
- Event Log: all events (connect, join, comment, etc.) appear here
- Browser Console: detailed logs prefixed with `[WebSocket]`

### Method 2: Node.js Script

For quick, headless tests from the terminal.

#### Steps

1. Get your JWT token:
   - Log in via the frontend
   - Open DevTools → Application → LocalStorage
   - Copy the value of `authToken`

2. Run the script:

   ```bash
   node scripts/ws-test.js "YOUR_JWT_TOKEN" REPORT_ID
   ```

   Example:

   ```bash
   node scripts/ws-test.js "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...." 123
   ```

3. Expected output:

   ```
   WebSocket Test Script
   =====================
   Server: http://localhost:3001
   Namespace: /ws/internal
   Report ID: 123

   Connecting to: http://localhost:3001/ws/internal
   Connected! Socket ID: abc123xyz
   Joining report room: 123

   Listening for events...
   (Press Ctrl+C to exit)
   ```

4. Create a comment from the backend and you should see:

   ```
   COMMENT CREATED
   -------------------------------
   {
     "id": 42,
     "comment": "Test comment",
     "commentOwner_id": 5,
     "creation_date": "2025-12-22T10:30:00.000Z",
     "report_id": 123
   }
   -------------------------------
   ```

### Method 3: React Component Integration

To integrate into an existing component:

```jsx
import { useWebSocket } from "../ws";

function MyReportComponent({ reportId }) {
  const [comments, setComments] = useState([]);
  const token = JSON.parse(localStorage.getItem("authToken"));

  const { isConnected } = useWebSocket({
    token,
    reportId,
    onCommentCreated: (newComment) => {
      console.log("New comment received:", newComment);
      setComments((prev) => [...prev, newComment]);
    },
  });

  return (
    <div>
      <p>WebSocket: {isConnected ? "Connected" : "Disconnected"}</p>
      {/* component body */}
    </div>
  );
}
```

## End-to-End Test

### Test Scenario

1. Setup:
   - Backend running on port 3001
   - Frontend running on port 5173
   - Database with at least one report and one internal user

2. Test Flow:

   ```
   ┌─────────────────┐
   │  1. Login       │ → Obtain JWT token
   └─────────────────┘
           ↓
   ┌─────────────────┐
   │  2. /ws-test    │ → Open test page
   └─────────────────┘
           ↓
   ┌─────────────────┐
   │  3. Connect     │ → Establish WS connection
   └─────────────────┘
           ↓
   ┌─────────────────┐
   │  4. Join Room   │ → Join the report room
   └─────────────────┘
           ↓
   ┌─────────────────┐
   │  5. Create      │ → (Backend) Create a comment
   │     Comment     │
   └─────────────────┘
           ↓
   ┌─────────────────┐
   │  6. Receive     │ → Frontend receives
   │     Event       │   comment.created
   └─────────────────┘
   ```

3. Verification:
   - Connection successfully established
   - Room join succeeded
   - Event received within ~100 ms
   - Payload contains all required fields

## Troubleshooting

### Error: "Unauthorized: missing token"

Cause: Token not provided or invalid

Solution:

- Ensure you are logged in
- Check that `localStorage.getItem('authToken')` returns a value
- Try logging in again

### Error: "Forbidden: not an internal user"

Cause: The token belongs to a citizen, not an internal user

Solution:

- Log in with an employee account (not citizen)
- Verify the token has `kind: "internal"`

### Not receiving events

Possible causes:

1. You are not in the correct room:
   - Verify the `reportId`
   - Check `currentReportId` in the test component

2. The backend is not emitting events:
   - Verify the backend emits after comment creation
   - Check backend logs when creating a comment
   - Ensure `emitCommentCreated()` is called

3. Wrong room:
   - Backend emits to `report:123`
   - Client joined `report:456`
   - Solution: use the same `reportId`

### Connection Error / Timeout

Cause: Backend unreachable or WebSocket not initialized

Solution:

- Ensure the backend is running
- Check that `initInternalSocket(server)` is called in `server.ts`
- Verify the URL: `http://localhost:3001`
- Check for CORS issues

### Multiple Connections

Cause: Singleton service not being respected

Solution:

- Close all frontend tabs
- Reload the page
- If it persists, ensure only one `io()` instance exists

## Monitoring

### Console Logs

The system outputs helpful logs to the browser console:

```javascript
[WebSocket] Connected: abc123xyz
[WebSocket] Joined report: 123
[WebSocket] Comment created: { id: 42, ... }
[WebSocket] Left report: 123
[WebSocket] Disconnected: transport close
```

### Network Tab

In Chrome DevTools → Network → WS:

- You should see an active WebSocket connection
- Name: `socket.io/?EIO=4&transport=websocket`
- Status: `101 Switching Protocols`
- Frames tab: shows all sent/received messages

## Test Checklist

Before considering the test complete, verify:

- [ ] Connection established successfully
- [ ] JWT token is valid and authenticated
- [ ] Join/Leave room work as expected
- [ ] Events are received correctly
- [ ] Payload is complete and correct
- [ ] Clean disconnection
- [ ] No errors in console
- [ ] Auto-reconnection works after disconnection

## Testing with Postman/curl

To create a comment and trigger the emission (replace with your real backend endpoints):

```bash
curl -X POST http://localhost:3001/api/reports/123/comments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"comment": "Test comment from curl"}'
```

Or with Postman:

- Method: POST
- URL: `http://localhost:3001/api/reports/{reportId}/comments`
- Headers: `Authorization: Bearer YOUR_TOKEN`
- Body: `{ "comment": "Test message" }`

## Best Practices

1. Isolate tests: use `/ws-test` before integrating elsewhere
2. One client at a time: avoid multiple connections from the same machine
3. Valid IDs: always use existing reportIds
4. Fresh token: if tests fail, log in again
5. Keep console open: monitor logs while testing
6. Backend logs: also check backend logs for debugging

## Additional Resources

- [Socket.IO Client Docs](https://socket.io/docs/v4/client-api/)
- [WebSocket Protocol](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Backend WebSocket Docs](../participium-backend/docs/websocket.md)

## Need help?

If nothing works:

1. Restart the backend
2. Restart the frontend
3. Clear localStorage: `localStorage.clear()`
4. Log in again
5. Retry the test

If issues persist, check:

- socket.io version compatibility (client/server)
- Firewall/antivirus blocking WebSocket
- Proxies or VPN interfering with connections
