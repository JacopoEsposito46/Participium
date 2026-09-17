import { useState, useEffect, useRef, useContext } from "react";
import { Form, Alert, Spinner } from "react-bootstrap";
import { MessageCircle, Send } from "lucide-react";
import PropTypes from "prop-types";
import API from "../../API/API";
import { UserContext } from "../../App";
import { useReportComments } from "../../ws";
import "../styles/CommentsChat.css";

function CommentsChat({ report }) {
  const { user, userRole } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [wsError, setWsError] = useState(null);
  const messagesContainerRef = useRef(null);

  // Token validation and management
  const token = localStorage.getItem("authToken")
    ? JSON.parse(localStorage.getItem("authToken"))
    : null;

  const isTokenValid = token && typeof token === "string" && token.length > 0;

  // WebSocket hook for real-time updates with error handling
  const { isConnected } = useReportComments(
    report.id,
    (newCommentData) => {
      // Add new comment to the list if it's not already there
      setComments((prev) => {
        const exists = prev.some((c) => c.id === newCommentData.id);
        if (!exists) {
          return [...prev, newCommentData];
        }
        return prev;
      });
      // Scroll to bottom when new comment arrives
      setTimeout(() => scrollToBottom(), 100);
    },
    isTokenValid ? token : null
  );

  // Monitor WebSocket connection status
  useEffect(() => {
    if (!isTokenValid) {
      setWsError("Authentication token is missing or invalid");
    } else if (!isConnected && !loading) {
      setWsError("Real-time updates unavailable. Comments will still work.");
    } else {
      setWsError(null);
    }
  }, [isConnected, isTokenValid, loading]);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  // Fetch initial comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await API.getReportComments(report.id);
        setComments(data || []);
        // Scroll to bottom after loading
        setTimeout(() => scrollToBottom(), 100);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
        setError(
          err.message ||
            "Failed to load comments. Please refresh the page to try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (report.id) {
      fetchComments();
    }
  }, [report.id]);

  const handleSendComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await API.createComment(report.id, newComment.trim());

      // Add comment to local state (if not already added by WebSocket)
      setComments((prev) => {
        const exists = prev.some((c) => c.id === response.id);
        if (!exists) {
          return [...prev, response];
        }
        return prev;
      });

      setNewComment("");
      scrollToBottom();
    } catch (err) {
      console.error("Failed to send comment:", err);
      setError(
        err.message || "Failed to send comment. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;

    // Format as date if older than 1 day
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" size="sm" className="me-2" />
        <span className="text-muted">Loading comments...</span>
      </div>
    );
  }

  return (
    <div className="comments-chat">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <MessageCircle size={20} className="text-primary" />
          <span className="report-desc-label fw-bold">Internal Chat</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          {isConnected && (
            <span
              className="badge bg-success"
              style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem" }}
            >
              ● Live
            </span>
          )}
          <span className="badge bg-secondary">{comments.length}</span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setError(null)}
          className="py-2 small"
        >
          {error}
        </Alert>
      )}

      {/* WebSocket Warning */}
      {wsError && !isConnected && (
        <Alert variant="warning" className="py-2 small">
          {wsError}
        </Alert>
      )}

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="comments-list mb-3"
        style={{
          maxHeight: "280px",
          overflowY: "auto",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "1rem",
          backgroundColor: "#f8f9fa",
        }}
      >
        {comments.length === 0 ? (
          <div className="text-center text-muted py-5">
            <MessageCircle size={48} className="mb-2 opacity-25" />
            <p className="mb-0">No comments yet. Start the conversation!</p>
          </div>
        ) : (
          comments.map((comment) => {
            const isOwnComment =
              Number(comment.commentOwner_id) === Number(user.profile.id);
            return (
              <div
                key={comment.id}
                className={`comment-bubble mb-3 ${isOwnComment ? "own-comment" : ""}`}
                style={{
                  display: "flex",
                  justifyContent: isOwnComment ? "flex-end" : "flex-start",
                  alignItems: "flex-end",
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "0.75rem 1rem",
                    borderRadius: isOwnComment
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                    backgroundColor: isOwnComment ? "#3d5a80" : "#ffffff",
                    color: isOwnComment ? "#ffffff" : "#293241",
                    boxShadow: isOwnComment
                      ? "0 2px 4px rgba(61, 90, 128, 0.3)"
                      : "0 2px 4px rgba(0,0,0,0.15)",
                    border: isOwnComment ? "none" : "1px solid #e0e0e0",
                    position: "relative",
                  }}
                >
                  {!isOwnComment && (
                    <div
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: "600",
                        marginBottom: "0.3rem",
                        color: "#3d5a80",
                        opacity: 0.8,
                      }}
                    >
                      {comment.commentOwner_name}
                      {comment.commentOwner_company && (
                        <span
                          style={{
                            fontWeight: "400",
                            marginLeft: "4px",
                            color: "#666",
                          }}
                        >
                          ({comment.commentOwner_company})
                        </span>
                      )}
                    </div>
                  )}
                  <div className="comment-text" style={{ fontSize: "0.95rem" }}>
                    {comment.comment}
                  </div>
                  <div
                    className="comment-timestamp mt-1"
                    style={{
                      fontSize: "0.7rem",
                      opacity: 0.65,
                      textAlign: isOwnComment ? "right" : "left",
                      fontStyle: "italic",
                    }}
                  >
                    {formatTimestamp(comment.creation_date)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Form */}
      <Form onSubmit={handleSendComment} className="mt-auto">
        <div className="chat-input-wrapper">
          <Form.Control
            as="textarea"
            rows={1}
            placeholder="Type your message..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendComment(e);
              }
            }}
            className="chat-textarea"
            disabled={submitting}
          />
          <button
            type="submit"
            className="chat-send-btn"
            disabled={submitting || !newComment.trim()}
            title="Send message"
          >
            {submitting ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              <Send size={16} strokeWidth={2} />
            )}
          </button>
        </div>
      </Form>
    </div>
  );
}

CommentsChat.propTypes = {
  report: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};

export default CommentsChat;
