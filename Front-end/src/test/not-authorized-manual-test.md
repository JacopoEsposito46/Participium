# Manual Testing Document: Not Authorized

## Not Authorized Page Test

### Purpose
Verify the 403 Forbidden fallback page acts as a graceful error handler for permission issues.

### Components involved
- "Not Authorized" Card
- "Go to Home" Button

### Test 1: Visual Verification
- Manually navigate to `/not-authorized` in the browser URL bar.
- **Verify that**:
  - A card is displayed in the center of the screen.
  - The message "You're not authorized to access this page" is visible.

### Test 2: Navigation Recovery
- Click the "Go to Home" button.
- **Verify that**:
  - The user is redirected to the Homepage (`/`).
