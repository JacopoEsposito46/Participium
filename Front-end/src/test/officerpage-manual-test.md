# Manual Testing Document: OfficerPage

## Purpose
Verify that Officers (technical/operational users) can view assigned reports, filter them, and **delegate reports to external companies**.

## Components involved
- Reports list
- Date range filters (start date, end date)
- Sort order dropdown
- Status filter dropdown
- Reset filters button
- Report cards
- Report description modal (read-only)
- Role header with icon

---

## Pre-conditions
- Log in as an Officer (e.g., "Street Maintenance Operator", "Public Lighting Operator", "Waste Management Operator", etc.)
- Navigate to the Officer Page
- Ensure there are reports assigned to the logged-in officer

---

## Test 1: Initial page load
**Objective:** Verify that the page loads correctly with all assigned reports.

**Steps:**
1. Log in as an Officer.
2. Navigate to the Officer Page.

**Verify:**
- A loading spinner appears with "Loading reports..." message.
- After loading, all reports assigned to the officer are displayed.
- Reports are sorted by newest first (default).
- The role header shows the correct role icon and role name (e.g., "Street Maintenance Operator").
- The counter shows the correct number of reports (e.g., "Showing 5 reports assigned to you").
- All filter dropdowns and date pickers show default values.

---

## Test 2: Role header display
**Objective:** Verify that the role header displays correctly for different officer roles.

**Steps:**
1. Log in as different officers (e.g., Public Lighting Operator, Waste Management Operator).
2. Navigate to the Officer Page for each.

**Verify:**
- The role icon circle is displayed with the correct icon for the role.
- The role name is displayed correctly next to the icon.
- The styling is consistent across different roles.

---

## Test 3: Report card display
**Objective:** Verify that report cards display all required information correctly.

**Steps:**
1. On the Officer Page, observe the list of report cards.

**Verify:**
- Each card shows:
  - Category icon in a circular container
  - Report title
  - Location (address or coordinates if address not available)
  - Category badge
  - Status badge in the top-right corner
- Status badge has the correct color/style based on status:
  - "Assigned" status badge
  - "In Progress" status badge
  - "Suspended" status badge
  - "Resolved" status badge
- Cards are clickable (cursor changes to pointer on hover)

---

## Test 4: Filter by start date
**Objective:** Verify that the start date filter works correctly.

**Steps:**
1. Click on the "Start Date" picker.
2. Select a date in the past (e.g., one week ago).

**Verify:**
- Only reports created on or after the selected date are shown.
- The counter updates to reflect the filtered count.
- Reports created before the selected date are hidden.
- The date appears in dd/MM/yyyy format in the picker.

---

## Test 5: Filter by end date
**Objective:** Verify that the end date filter works correctly.

**Steps:**
1. Click on the "End Date" picker.
2. Select a date (e.g., yesterday).

**Verify:**
- Only reports created on or before the selected date (until 23:59:59) are shown.
- The counter updates accordingly.
- Reports created after the selected date are hidden.
- The date appears in dd/MM/yyyy format in the picker.

---

## Test 6: Filter by date range
**Objective:** Verify that filtering by both start and end date works correctly.

**Steps:**
1. Select a start date (e.g., two weeks ago).
2. Select an end date (e.g., one week ago).

**Verify:**
- Only reports within the date range are displayed.
- The counter shows the correct filtered count.
- Reports outside the range are hidden.

---

## Test 7: Filter by status - All
**Objective:** Verify that selecting "All" shows all reports.

**Steps:**
1. Click the "Status" dropdown.
2. Select "All".

**Verify:**
- All assigned reports are displayed.
- The dropdown shows "All" as selected.
- The counter shows the total number of reports.

---

## Test 8: Filter by status - Assigned
**Objective:** Verify that filtering by "Assigned" status works correctly.

**Steps:**
1. Click the "Status" dropdown.
2. Select "Assigned".

**Verify:**
- Only reports with status "Assigned" are displayed.
- The dropdown shows "Assigned" as selected.
- The counter updates to show only assigned reports.
- All displayed cards have "Assigned" status badge.

---

## Test 9: Filter by status - In Progress
**Objective:** Verify that filtering by "In Progress" status works correctly.

**Steps:**
1. Click the "Status" dropdown.
2. Select "In Progress".

**Verify:**
- Only reports with status "In Progress" are displayed.
- The dropdown shows "In Progress" as selected.
- The counter updates accordingly.
- All displayed cards have "In Progress" status badge.

---

## Test 10: Filter by status - Suspended
**Objective:** Verify that filtering by "Suspended" status works correctly.

**Steps:**
1. Click the "Status" dropdown.
2. Select "Suspended".

**Verify:**
- Only reports with status "Suspended" are displayed.
- The dropdown shows "Suspended" as selected.
- The counter updates accordingly.
- All displayed cards have "Suspended" status badge.

---

## Test 11: Filter by status - Resolved
**Objective:** Verify that filtering by "Resolved" status works correctly.

**Steps:**
1. Click the "Status" dropdown.
2. Select "Resolved".

**Verify:**
- Only reports with status "Resolved" are displayed.
- The dropdown shows "Resolved" as selected.
- The counter updates accordingly.
- All displayed cards have "Resolved" status badge.

---

## Test 12: Sort by date - Newest First
**Objective:** Verify that sorting by newest first works correctly.

**Steps:**
1. Click the "Sort by Date" dropdown.
2. Select "Newest First".

**Verify:**
- Reports are ordered with the most recent at the top.
- The dropdown shows "Newest First" as selected.
- The creation dates decrease as you scroll down.

---

## Test 13: Sort by date - Oldest First
**Objective:** Verify that sorting by oldest first works correctly.

**Steps:**
1. Click the "Sort by Date" dropdown.
2. Select "Oldest First".

**Verify:**
- Reports are ordered with the oldest at the top.
- The dropdown shows "Oldest First" as selected.
- The creation dates increase as you scroll down.

---

## Test 14: Combine multiple filters
**Objective:** Verify that multiple filters work together correctly.

**Steps:**
1. Select a status filter (e.g., "In Progress").
2. Select a start date.
3. Select an end date.
4. Change the sort order to "Oldest First".

**Verify:**
- All filters are applied simultaneously.
- Only reports matching all criteria are shown.
- Reports are sorted according to the selected order.
- The counter reflects the filtered results.

---

## Test 15: Reset filters
**Objective:** Verify that the reset button clears all filters.

**Steps:**
1. Apply multiple filters:
   - Select a status (e.g., "Assigned")
   - Select a start date
   - Select an end date
   - Change sort order to "Oldest First"
2. Click the "Reset" button.

**Verify:**
- Status filter returns to "All".
- Start date picker is cleared.
- End date picker is cleared.
- Sort order returns to "Newest First".
- All reports are displayed again.
- The counter shows the total number of reports.

---

## Test 16: No reports matching filters
**Objective:** Verify the display when no reports match the selected filters.

**Steps:**
1. Apply filters that result in no matches (e.g., status "Resolved" + very recent date range with no resolved reports).

**Verify:**
- An info alert appears: "No reports found matching the selected filters."
- The counter shows "Showing 0 reports assigned to you".
- No report cards are displayed.
- The filters remain active.

---

## Test 17: Click on a report card
**Objective:** Verify that clicking a report card navigates to the Report Management page.

**Steps:**
1. Click on any report card in the list.

**Verify:**
- The application navigates to the Report Management page (`/reports/:id`).
- The URL changes to include the report ID.
- The page shows "Back to List" button at the top.

---

## Test 18: Report Management Page - Read-only view
**Objective:** Verify that the report details page displays correctly for officers.

**Steps:**
1. Click on a report card to open the details page.
2. Review all displayed information.

**Verify the page displays:**
- **Header:**
  - "Back to List" button
  - Report ID badge
  - Status badge (colored correctly)
- **Report Info (Left Column):**
  - **Citizen Details:** Name
  - **Report Information:** Title, Description, Address (with map pin)
  - **Location:** Interactive map (read-only)
  - **Category:** Category icon and name
  - **Photos:** Grid of photos (click to enlarge)
- **Action Panel (Right Column):**
  - Displays appropriate actions based on role (e.g., Delegation or PRO Review)
  - Or an info message if no actions available

**Verify that:**
- There is NO close button (X), but a "Back to List" button.
- The layout is divided into Report Info and Action/Chat panel.

---

## Test 19: View report photos
**Objective:** Verify that report photos can be viewed in full size.

**Steps:**
1. Open a report page that has photos.
2. Click on one of the photo thumbnails.

**Verify:**
- A photo preview modal opens.
- The photo is displayed in full size.
- The modal allows navigation if multiple photos (optional).
- Closing the photo modal leaves the Report Page open.

---

## Test 20: Navigate back to list
**Objective:** Verify that the "Back to List" button works correctly.

**Steps:**
1. Open a report page.
2. Click the "Back to List" button (top left).

**Verify:**
- The application returns to the Officer Page.
- **Critical:** The previously applied filters (status, date, etc.) are PRESERVED.
- The scroll position is maintained (if possible) or at least the filters are kept.

---

## Test 21: Report address geocoding
**Objective:** Verify that report addresses are loaded correctly.

**Steps:**
1. Observe report cards as they load on the list page.

**Verify:**
- Initially, coordinates may be shown.
- Addresses are resolved and displayed properly.

---

## Test 22: Internal Chat (CommentsChat)
**Objective:** Verify that the internal chat is available on the Report Page.

**Steps:**
1. Open a report that is NOT in "Assigned" status (unless logic allows).
2. Look for the "Internal Chat" card in the right column (below actions).

**Verify:**
- The chat component is visible.
- It shows "Internal Chat" header.
- "Live" badge is present if connected.
- You can type and send a message.
- The message appears in the list.

---

## Test 23: Error handling - Failed to load reports
**Objective:** Verify error handling when reports cannot be loaded.

**Steps:**
1. Simulate a network error (disconnect network or use browser dev tools).
2. Reload the Officer Page.

**Verify:**
- A loading spinner appears initially.
- After the error, a danger alert appears.
- No reports are displayed.

---

## Test 24: Empty state - No assigned reports
**Objective:** Verify the display when the officer has no assigned reports.

**Steps:**
1. Log in as an officer with no assigned reports.
2. Navigate to the Officer Page.

**Verify:**
- The page loads successfully.
- An info alert or empty state message appears.
- The filters are still available.

---

## Test 25: Counter accuracy
**Objective:** Verify that the report counter is accurate in all scenarios.

**Steps:**
1. Load the page and note the counter.
2. Apply different filters.

**Verify:**
- Counter updates immediately when filters change.
- Matches the visible count of cards.

---

## Test 26: Date picker interaction
**Objective:** Verify that date pickers work correctly.

**Steps:**
1. Click on "Start Date" or "End Date" picker.

**Verify:**
- Calendar opens.
- Can select date.
- Date format is correct (dd/MM/yyyy).

---

## Test 27: Filter persistence during navigation
**Objective:** Verify filter state when navigating to details and back.

**Steps:**
1. Apply filters on Officer Page.
2. Click a report to go to Report Page.
3. Click "Back to List".

**Verify:**
- Filters are still applied.
- The list shows the filtered results.

---

## Test 28: Responsive layout - Mobile
**Objective:** Verify the layout on mobile screens.

**Steps:**
1. View Officer Page and Report Page on mobile size.

**Verify:**
- **Officer Page:** Filters stack, cards are full width.
- **Report Page:** Columns stack (Actions/Chat move below Info).


---

## Test 30: Multiple officer roles
**Objective:** Verify that different officer roles see only their assigned reports.

**Steps:**
1. Log in as "Public Lighting Operator".
2. Note the displayed reports (e.g., categories related to public lighting).
3. Log out and log in as "Street Maintenance Operator".
4. Note the displayed reports (e.g., categories related to street maintenance).

**Verify:**
- Each officer sees only reports assigned to their role.
- Report categories match the officer's area of responsibility.
  - The role header displays the correct role name for each user.

---

## Test 31: Delegate Report Flow
**Objective:** Verify that an officer can delegate a report to an external company.

**Steps:**
1. Open a report with status "Assigned" (or any status allowing delegation if applicable).
2. Locate the "Delegate Report" section in the modal.
3. Click the "Choose a company" dropdown.
4. Select a company from the list.
5. Click the "Delegate to Company" button.

**Verify:**
1. A loading spinner appears on the button.
2. The modal closes (or shows a success message).
3. The report is **removed** from the Officer's "Assigned Reports" list (since it's now delegated).

## Test 32: Delegation Validation
**Objective:** Verify validation when delegating without selecting a company.

**Steps:**
1. Open a report modal.
2. Click "Delegate to Company" **without** selecting a company.

**Verify:**
1. An error alert appears: "Please select a company."
2. The delegation request is NOT sent.

---

## Notes
- Officers have read-only access to reports - they can view but not modify or judge reports.
- The actual actions on reports (status changes, updates) are not managed in this interface.
- If action buttons appear in the modal, this indicates a configuration error (`isOfficerView` should be `true`).