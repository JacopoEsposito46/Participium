# Manual Testing Document: Report Management Page

## Report Management Page Test

### Purpose
Verify that the Public Relations Officer and other officers can view report details and manage status. verify that **Technical Officers and Maintainers** can communicate via internal chat.

### Components involved
- Report details page (full screen)
- Report Info (Left column): Map, Address, Description, Photos
- Action Panel (Right column): PRO Actions, Delegation, Maintains Actions
- **Internal Chat** (CommentsChat)
- Navigation bar ("Back to List")

### Test 1: Navigate to Report Page
- Click on a report card from the dashboard/list.
- Verify that:
  - The application navigates to `/reports/:id`.
  - The page loads with "Report ID: X" badge in the header.
  - All report fields are populated correctly.
  - The map shows the correct location.
  - The "Internal Chat" section is visible (if applicable).

### Test 2: View report details
- Navigate to a report page.
- Verify that:
  - Title and Description are correct.
  - Address is displayed with a pin icon.
  - Creation date is formatted correctly.
  - Map is interactable (but markers are read-only).
  - Photos are displayed in a grid.

### Test 3: Change category (PRO only)
- Locate the "Category" section in the Report Info card.
- Click the category dropdown (if user is PRO).
- Select a different category.
- Verify that:
  - The category updates immediately.
  - A success indicator or toast might appear (depending on implementation).

### Test 4: View photos
- Click on a photo thumbnail.
- Verify that:
  - The photo preview modal opens.
  - Full-size image is shown.
  - Can close the modal and return to the Report Page.

### Test 5: Approve action (PRO)
- *Prerequisite*: Logged in as Public Relations Officer.
- Ensure the Action Panel shows "PRO Review".
- Verify "Approve" is selected by default.
- Click "Approve Report".
- Verify that:
  - Success message appears ("Operation Completed Successfully").
  - "Close and Go Back" button is shown.
  - Clicking it returns to the dashboard.

### Test 6: Reject action (PRO)
- Switch to "Reject" mode in the Action Panel.
- Enter an explanation.
- Click "Reject Report".
- Verify that:
  - Success message appears.
  - Report status updates to Rejected.

### Test 7: Reject without explanation (Validation)
- Select "Reject".
- Leave explanation empty.
- Click "Reject Report".
- Verify that:
  - HTML5 validation or error alert prevents submission.

### Test 8: Internal Chat Presence (Technical Officers/Maintainers only)
- *Prerequisite*: Logged in as a Technical Officer or External Maintainer.
- Open a report that is not "Assigned".
- Verify that:
  - The "Internal Chat" card is visible below the Action Panel.
  - Previous comments are loaded.
  - "Live" status is indicated.

### Test 9: Send Internal Comment
- Type a message in the chat input.
- Click Send.
- Verify that:
  - Message appears in the list.
  - Comment count updates.

### Test 10: Back Navigation
- Click "Back to List" at the top left.
- Verify that:
  - User is returned to the previous dashboard/list.
  - Filters on the previous page are preserved.

### Test 11: Error handling
- Simulate network failure while loading.
- Verify that:
  - Error alert "Unable to load report details" is shown.
  - "Back to the Dashboard" button is available.

### Test 12: Mobile Responsiveness
- Resize to mobile view.
- Verify that:
  - Layout stacks: Report Info on top, Action Panel and Chat below.
  - All buttons remain accessible.
