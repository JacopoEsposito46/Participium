import React, { useState, useEffect } from "react";
import { useWebSocket, socketService } from "../ws";
import "./styles/WebSocketTest.css";

/**
 * WebSocket Test Component
 *
 * This component allows you to test the WebSocket connection.
 *
 * Usage:
 * 1. Import it in App.jsx or register a route
 * 2. Log in as an internal user (employee)
 * 3. Enter a valid reportId
 * 4. Observe real-time events
 *
 * Example in App.jsx:
 * import WebSocketTest from './components/WebSocketTest';
 * <Route path="/ws-test" element={<WebSocketTest />} />
 */
function WebSocketTest() {
  const [token, setToken] = useState("");
  const [reportId, setReportId] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [events, setEvents] = useState([]);
  const [manualToken, setManualToken] = useState("");
  const [backendUrl, setBackendUrl] = useState("");

  // Load token from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = JSON.parse(localStorage.getItem("authToken"));
      if (storedToken) {
        setToken(storedToken);
        setManualToken(storedToken);
      }

      // Prefer env, fallback to page origin so we avoid localhost hardcoding
      const resolvedUrl =
        import.meta.env.VITE_BACKEND_URL ||
        (typeof window !== "undefined" ? window.location.origin : "");
      setBackendUrl(resolvedUrl);
    } catch (error) {
      console.error("Error loading token:", error);
    }
  }, []);

  const addEvent = (type, data) => {
    const event = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      type,
      data,
    };
    setEvents((prev) => [event, ...prev].slice(0, 50)); // Keep last 50 events
  };

  const { isConnected, currentReportId, joinReport, leaveReport } =
    useWebSocket({
      token: null, // do not auto-connect
      reportId: null, // no auto-join
      onCommentCreated: (comment) => {
        addEvent("COMMENT_CREATED", comment);
      },
      onConnect: (data) => {
        addEvent("CONNECTED", data);
        setIsActive(true);
      },
      onDisconnect: (data) => {
        addEvent("DISCONNECTED", data);
        setIsActive(false);
      },
      onError: (error) => {
        addEvent("ERROR", {
          message: error,
          hint: "Check CORS, token kind=internal, and ws URL",
        });
      },
      autoConnect: false,
    });

  const handleConnect = () => {
    if (!token) {
      alert("Missing token. Please log in as an internal user.");
      return;
    }
    // Connect directly via the service
    socketService.connect(token, backendUrl || undefined);
    addEvent("CONNECT_ATTEMPT", {
      url: `${backendUrl || window.location.origin}/ws/internal`,
      tokenPreview: `${String(token).slice(0, 8)}...`,
      transports: ["websocket", "polling"],
    });
  };

  const handleDisconnect = () => {
    socketService.disconnect();
    addEvent("MANUAL_DISCONNECT", { message: "Manually disconnected" });
  };

  const handleJoinReport = () => {
    if (!reportId || isNaN(Number(reportId))) {
      alert("Enter a valid numeric reportId");
      return;
    }
    joinReport(Number(reportId));
    addEvent("JOIN_REPORT", { reportId: Number(reportId) });
  };

  const handleLeaveReport = () => {
    if (!currentReportId) {
      alert("You are not in any report room");
      return;
    }
    leaveReport(currentReportId);
    addEvent("LEAVE_REPORT", { reportId: currentReportId });
  };

  const handleUpdateToken = () => {
    setToken(manualToken);
    addEvent("TOKEN_UPDATED", { message: "Token updated" });
  };

  const clearEvents = () => {
    setEvents([]);
  };

  const getEventTypeStyle = (type) => {
    const styles = {
      CONNECTED: "event-success",
      DISCONNECTED: "event-warning",
      ERROR: "event-error",
      COMMENT_CREATED: "event-info",
      JOIN_REPORT: "event-primary",
      LEAVE_REPORT: "event-secondary",
      MANUAL_DISCONNECT: "event-warning",
      TOKEN_UPDATED: "event-info",
    };
    return styles[type] || "event-default";
  };

  return (
    <div className="websocket-test-container">
      <div className="test-header">
        <h1>WebSocket Test Panel</h1>
        <div className="status-badge">
          Status:{" "}
          <span
            className={isConnected ? "status-connected" : "status-disconnected"}
          >
            {isConnected ? "CONNECTED" : "DISCONNECTED"}
          </span>
        </div>
      </div>

      <div className="test-sections">
        {/* Connection Section */}
        <div className="test-section">
          <h2>Authentication</h2>
          <div className="form-group">
            <label>
              JWT Token:
              <small> (automatically from localStorage)</small>
            </label>
            <textarea
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder="Enter token manually (or log in)"
              rows={3}
              disabled={isActive}
            />
            {!isActive && (
              <button onClick={handleUpdateToken} className="btn-secondary">
                Update Token
              </button>
            )}
          </div>
          <div className="form-group">
            <label>Backend URL (WS base)</label>
            <input
              type="text"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              placeholder="https://api.example.com"
              disabled={isActive}
            />
            <small className="help-text">
              If empty, the page origin is used. Namespace: /ws/internal
            </small>
          </div>
          <div className="button-group">
            {!isConnected ? (
              <button
                onClick={handleConnect}
                className="btn-primary"
                disabled={!token}
              >
                Connect
              </button>
            ) : (
              <button onClick={handleDisconnect} className="btn-danger">
                Disconnect
              </button>
            )}
          </div>
        </div>

        {/* Report Room Section */}
        <div className="test-section">
          <h2>Report Room</h2>
          <div className="form-group">
            <label>Report ID:</label>
            <input
              type="number"
              value={reportId}
              onChange={(e) => setReportId(e.target.value)}
              placeholder="e.g., 123"
              disabled={!isConnected}
            />
          </div>
          <div className="info-row">
            <strong>Current Room:</strong>{" "}
            {currentReportId ? `report:${currentReportId}` : "None"}
          </div>
          <div className="button-group">
            <button
              onClick={handleJoinReport}
              className="btn-primary"
              disabled={!isConnected || !reportId}
            >
              Join Report
            </button>
            <button
              onClick={handleLeaveReport}
              className="btn-secondary"
              disabled={!isConnected || !currentReportId}
            >
              Leave Report
            </button>
          </div>
        </div>

        {/* Events Log Section */}
        <div className="test-section events-section">
          <div className="events-header">
            <h2>Event Log</h2>
            <button onClick={clearEvents} className="btn-small">
              Clear
            </button>
          </div>
          <div className="events-list">
            {events.length === 0 ? (
              <div className="no-events">No events recorded</div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className={`event-item ${getEventTypeStyle(event.type)}`}
                >
                  <div className="event-header">
                    <span className="event-type">{event.type}</span>
                    <span className="event-time">
                      {new Date(event.timestamp).toLocaleTimeString("en-US")}
                    </span>
                  </div>
                  <pre className="event-data">
                    {JSON.stringify(event.data, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="test-instructions">
        <h3>Test Instructions</h3>
        <ol>
          <li>
            <strong>Login:</strong> Log in as an internal user (employee). The
            token will be loaded automatically.
          </li>
          <li>
            <strong>Connect:</strong> Click Connect to establish the WebSocket
            connection.
          </li>
          <li>
            <strong>Join Report:</strong> Enter a valid reportId and click Join
            Report to join the room.
          </li>
          <li>
            <strong>Test:</strong> From the backend, create a comment for that
            report. You should see a COMMENT_CREATED event appear in the log.
          </li>
          <li>
            <strong>Verify:</strong> Also check the browser console for detailed
            [WebSocket] logs.
          </li>
        </ol>

        <h4>Test with curl (from terminal):</h4>
        <pre className="code-block">
          {`# Example: create a comment (replace with real endpoint)
curl -X POST http://localhost:3001/api/reports/{reportId}/comments \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"comment": "Test comment"}'`}
        </pre>

        <h4>Troubleshooting:</h4>
        <ul>
          <li>
            <strong>401 Unauthorized:</strong> Invalid token or not an internal
            user
          </li>
          <li>
            <strong>No events:</strong> Verify you are in the correct room
            (correct reportId)
          </li>
          <li>
            <strong>Connection error:</strong> Verify the backend is running and
            the WebSocket is initialized
          </li>
        </ul>
      </div>
    </div>
  );
}

export default WebSocketTest;
