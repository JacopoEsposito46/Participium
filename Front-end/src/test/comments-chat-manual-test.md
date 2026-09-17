# Manual Testing Document: Comments Chat

## CommentsChat Component Test

### Purpose
Verify that the CommentsChat component facilitates real-time internal communication between staff members (Officers and Maintainers) with proper synchronization, error handling, and visual feedback.

### Components involved
- Internal Chat header and Live indicator
- Comments list container
- Comment bubbles (Own vs. Others)
- Message input field
- Send button
- Error alerts

### Test 1: Initial Load (Empty State)
- Open a report that has no comments.
- Verify that:
  - The "Internal Chat" header is visible.
  - The "Live" badge is green (if WebSocket is connected).
  - The message "No comments yet. Start the conversation!" is displayed.
  - The loading spinner is not visible.

### Test 2: Send a Comment (Standard Flow)
- Type "Test comment" in the input field.
- Click the Send icon or press Enter.
- Verify that:
  - The text input clears immediately.
  - The new comment appears at the bottom of the list.
  - The comment is right-aligned and styled in blue (indicating "own" comment).
  - The timestamp says "just now".
  - The comments count in the header increases.

### Test 3: Send Button State (Empty Input)
- Clear the input field.
- Verify that:
  - The Send button is disabled (or grayed out).
  - Pressing Enter does not trigger any action.

### Test 4: Real-time Update (Receiving a Comment)
- *Prerequisite*: Have the same report open in a second browser window (or incognito) logged in as a different user (e.g., another Officer or Maintainer).
- From the second window, send a message: "Hello from the other side".
- In the first window, verify that:
  - The new comment appears automatically at the bottom without refreshing.
  - The comment is left-aligned and styled in white.
  - A label (e.g., "Officer" or "Maintainer") appears above the comment text.
  - The chat view scrolls to the bottom automatically.

### Test 5: WebSocket Connection Status
- Verify that:
  - When the page loads, the "Live" badge appears in green.
  - If the network is disconnected (simulate offline in DevTools), the component handles the disconnection (behavior depends on implementation, usually the badge might disappear or an error might show).
  - *Note*: The code handles `!isConnected` by showing a warning "Real-time updates unavailable" if not loading.

### Test 6: Error Handling (Sending Failed)
- *Prerequisite*: Simulate a network error (e.g., block the API request in DevTools).
- Try to send a comment.
- Verify that:
  - An error alert appears: "Failed to send comment..."
  - The loading spinner (if applied on button) disappears.
  - The user can retry.

### Test 7: Historical Comments Styling
- Open a report with existing comments.
- Verify that:
  - Old comments are displayed with correct timestamps (e.g., "2h ago" or specific date).
  - Own comments are consistently right-aligned/blue.
  - Others' comments are consistently left-aligned/white.

### Test 8: Long Text Handling
- Type a very long comment (multi-line).
- Send the comment.
- Verify that:
  - The text wraps correctly inside the bubble.
  - It does not break the layout or overflow the container.
