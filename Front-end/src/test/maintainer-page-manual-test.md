# Manual Testing Document: Maintainer Page

## Maintainer Page Test

### Purpose
Verify the dashboard for External Maintainers, ensuring they can view, filter, and manage their assigned maintenance tasks.

### Components involved
- Header (Work Orders title)
- Sidebar Filters (Status, Date Range, Sort)
- Task List (Report Cards)
- Maintainer Report Modal

### Test 1: View Task List
- Log in as an "External Maintainer".
- Navigate to `/maintainer`.
- **Verify that**:
  - The page loads without errors.
  - A list of assigned reports (tasks) is displayed.
  - The total count of tasks matches the number of items in the list.

### Test 2: Status Filtering
- In the sidebar, click the "Status" dropdown (default "All").
- Select "Assigned".
- **Verify that**:
  - The list updates to show *only* reports with "Assigned" status.
  - The counter at the top updates to reflect the filtered count.

### Test 3: Date Filtering
- Select a "Start Date" and "End Date" in the sidebar date pickers.
- **Verify that**:
  - The list filters reports created within that date range.

### Test 4: Sorting
- Change the "Sort by Date" dropdown from "Newest First" to "Oldest First".
- **Verify that**:
  - The order of reports in the list is reversed.

### Test 5: Reset Filters
- Apply a combination of status and date filters.
- Click the "Reset Filters" button.
- **Verify that**:
  - Status returns to "All".
  - Dates are cleared.
  - The full list of reports is displayed again.

### Test 6: Open Task Details
- Click on any report card in the list.
- **Verify that**:
  - The application navigates to the Report Management page (`/reports/:id`).
  - The URL includes the report ID.
  - The page shows "Back to List" button.
  - The "Internal Chat" section is visible.

### Test 7: Internal Chat (CommentsChat)
- Open a report.
- **Verify that**:
  - The "Internal Chat" card is visible below the Action Panel.
  - You can send a message.
  - "Live" status is indicated if connected.
  - Messages from officers are visible.

### Test 8: Status Update Workflows
**Objective:** Verify all status transitions available to the maintainer.

#### Flow A: Start Work
- **Pre-condition**: Report status is "Assigned" or "Delegated".
- Open the report page.
- Locate the "Intervention Update" panel (right column).
- Click the "Start Work" button (Hammer icon).
- **Verify that**:
  - Success message appears ("Operation Completed Successfully").
  - The status badge updates to "**In Progress**".

#### Flow B: Suspend Work
- **Pre-condition**: Report status is "In Progress".
- Open the report page.
- Click the "Suspend" button (Pause icon).
- **Verify that**:
  - Success message appears.
  - Status badge updates to "**Suspended**".

#### Flow C: Resume Work
- **Pre-condition**: Report status is "Suspended".
- Open the report page.
- Click the "Start Work" button (or Resume).
- **Verify that**:
  - Success message appears.
  - Status badge updates to "**In Progress**".

#### Flow D: Resolve Report
- **Pre-condition**: Report status is "In Progress".
- Open the report page.
- Enter a "Technical Note" (e.g., "Filled the pothole").
- Click the "Resolved" button (Check icon).
- **Verify that**:
  - Success message appears.
  - Status badge updates to "**Resolved**".

### Test 9: Back Navigation
- From the Report Page, click "Back to List".
- **Verify that**:
  - You return to the Maintainer Dashboard.
  - Filters are still applied.


### Test 10: Zero Results State
- Set filters to a date range in the far past (e.g., year 1990).
- **Verify that**:
  - The list is empty.
  - Examples of "No tasks found" message or icon are displayed.
