# Manual Testing Document: Public Relations Officer Dashboard

## Public Relations Officer Dashboard Test

### Purpose
Verify that the Public Relations Officer can view, filter, and sort pending reports correctly.

### Components involved
- Reports list
- Category filter dropdown
- Date range filters (start date, end date)
- Sort order dropdown
- Reset filters button
- Report cards
- Report description modal

### Test 1: Initial page load
- Log in as a Public Relations Officer.
- Navigate to the reports dashboard.
- Verify that:
  - A loading spinner appears with "Loading reports..." message.
  - After loading, all pending reports are displayed.
  - Reports are sorted by newest first (default).
  - The counter shows the correct number of reports.
  - All filter dropdowns show default values.

### Test 2: Filter by category
- On the dashboard, click the "Category" dropdown.
- Select a specific category (e.g., "Road Damage").
- Verify that:
  - Only reports with the selected category are displayed.
  - The category icon appears in the dropdown button.
  - The counter updates to show the filtered count.
  - Non-matching reports are hidden.

### Test 3: Filter by start date
- Click on the "Start Date" picker.
- Select a date in the past.
- Verify that:
  - Only reports created on or after the selected date are shown.
  - The counter updates accordingly.
  - Reports created before the date are hidden.

### Test 4: Filter by end date
- Click on the "End Date" picker.
- Select a date.
- Verify that:
  - Only reports created on or before the selected date (23:59:59) are shown.
  - The counter updates accordingly.
  - Reports created after the date are hidden.

### Test 5: Filter by date range
- Select both a start date and end date.
- Verify that:
  - Only reports within the date range are displayed.
  - The counter shows the correct filtered count.

### Test 6: Sort by date (newest first)
- Click the "Sort by Date" dropdown.
- Select "Newest First".
- Verify that:
  - Reports are ordered with the most recent at the top.
  - The dropdown shows "Newest First" as selected.

### Test 7: Sort by date (oldest first)
- Click the "Sort by Date" dropdown.
- Select "Oldest First".
- Verify that:
  - Reports are ordered with the oldest at the top.
  - The dropdown shows "Oldest First" as selected.

### Test 8: Combine multiple filters
- Select a category.
- Select a start date.
- Select an end date.
- Change the sort order.
- Verify that:
  - All filters are applied simultaneously.
  - The results match all selected criteria.
  - The counter reflects the filtered results.

### Test 9: Reset filters
- Apply multiple filters (category, dates, sort order).
- Click the "Reset" button.
- Verify that:
  - All filters return to default values.
  - Category shows "All Categories".
  - Date pickers are cleared.
  - Sort order returns to "Newest First".
  - All reports are displayed again.

### Test 10: No reports matching filters
- Apply filters that result in no matches.
- Verify that:
  - An info alert appears: "No reports found matching the selected filters."
  - The counter shows "Showing 0 reports".
  - No report cards are displayed.

### Test 11: Click on a report card
- Click on any report card.
- Verify that:
  - The application navigates to the Report Management page (`/reports/:id`).
  - The URL changes to include the report ID.
  - The page shows "Back to List" button at the top.

### Test 12: Back Navigation
- From the Report Page, click "Back to List".
- Verify that:
  - You return to the PRO Dashboard.
  - Filters (Category, Date, etc.) are still applied.
  - Scroll position is maintained (optional).

### Test 13: Error handling
- Simulate a network error (disconnect network).
- Reload the page.
- Verify that:
  - A loading spinner appears initially.
  - An error alert appears: "Failed to load reports. Please try again later."
  - No reports are displayed.

### Test 14: Category dropdown navigation
- Open the category dropdown.
- Verify that:
  - "All Categories" is listed first.
  - All available categories are listed with their icons.
  - Active category is highlighted.
  - Clicking a category updates the filter immediately.

### Test 15: Date picker functionality
- Click on the start date picker.
- Verify that:
  - A calendar appears.
  - Dates can be selected by clicking.
  - The selected date appears in dd/MM/yyyy format.
  - The picker closes after selection.

### Test 16: Responsive layout
- Resize the browser window to mobile size.
- Verify that:
  - Filters stack vertically on smaller screens.
  - Report cards remain readable.
  - Dropdowns and date pickers are still accessible.