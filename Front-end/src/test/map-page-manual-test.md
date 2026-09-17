# Manual Testing Document: Map Page

## Map Page Test

### Purpose

Verify the core functionality of the application: viewing the map, interacting with reports, and creating new reports.

### Components involved

- Map Container (Leaflet)
- Layers Control (Street, Satellite, etc.)
- Report Pins and Clusters
- Report Sidebar (List of reports)
- Report Form (Offcanvas)
- Search Bar

### Test 1: Map Initialization and Layers

- Open the `/map` page.
- **Verify that**:
  - The map loads and centers on Turin.
  - The Turin city boundary is highlighted (inside is clear, outside is masked).
  - The layer control allows switching between "Street Map (Standard)", "Light Map (Voyager)", and "Satellite".

### Test 2: Create New Report (Inside Turin)

- Click on a location inside the Turin boundaries.
- **Verify that**:
  - The map zooms in and centers on the clicked point (animation).
  - The "Create New Report" form (Side panel) opens on the left.
  - The clicked location is marked with a temporary marker.
- Close the form.
- **Verify that**:
  - The form closes and the temporary marker disappears.

### Test 3: Invalid Location Click (Outside Turin)

- Zoom out and click on a location clearly outside the Turin boundaries.
- **Verify that**:
  - An "Invalid Location" modal appears stating the service is only active in Turin.
  - The report form does NOT open.

### Test 4: Viewing Existing Reports

- Ensure there are existing reports on the server.
- **Verify that**:
  - Clusters (colored circles with numbers) appear for grouped reports.
  - Individual pins appear for isolated reports.
- Click on a cluster.
- **Verify that**:
  - The map zooms in to split the cluster.
- Click on a specific report pin.
- **Verify that**:
  - A popup appears above the pin with the report status and address.
  - Clicking "Show Details" in the popup opens the detailed view of the report.

### Test 5: Sidebar Toggle

- **Desktop**:
  - Verify the sidebar with the list of reports is visible by default (or user preference).
  - Click the "Reports" tab/button to toggle the sidebar visibility.
- **Mobile** (Simulation):
  - Resize browser window to mobile width.
  - Verify the sidebar is hidden by default.
  - Click the "Reports" Floating Action Button (FAB).
  - **Verify that**: The sidebar slides in from the bottom.

### Test 6: Search Functionality

- Type "Politecnico di Torino" in the search bar.
- Select the first result.
- **Verify that**:
  - The map flies to the selected location.
  - The map centers on the searched location without opening any forms.

### Test 7: Full Report Submission Flow

- **Pre-condition**: Logged in as Citizen.
- Click on a valid location on the map.
- Fill in the form:
  - Title: "Broken Bench".
  - Description: "Wooden bench broken in half".
  - Category: Select "Public Furniture/Structures".
  - Image: Upload a sample image.
- Click "Submit Report".
- **Verify that**:
  - The form closes.
  - A success modal appears ("Report Submitted Successfully").
  - A new pin appears on the map at the reported location.

### Test 8: Dynamic Loading (Pan & Zoom)

- Drag the map to a different area of Turin.
- **Verify that**:
  - The "GetBoundsLogger" triggers a new fetch (network request).
  - New reports populate in the area (if any).
  - The "Reports found" counter in the sidebar updates.

### Test 9: Authentication Required

- **Pre-condition**: NOT logged in (no Citizen or Internal User session).
- Click on a valid location inside Turin boundaries.
- **Verify that**:
  - A "Login Required" modal appears.
  - The report form does NOT open.
  - No temporary marker appears on the map.

### Test 10: Report Card Interaction

- **Pre-condition**: Sidebar is open with visible reports.
- Click on a report card in the sidebar.
- **Verify that**:
  - The map flies to the selected report location.
  - The report pin becomes selected (popup opens).

### Test 11: Popup Auto-Close Behavior

- Click on a report pin to open its popup.
- **Verify that** the popup closes when:
  - Dragging the map.
  - Zooming in/out.
  - Clicking the '×' button in the popup.

### Test 12: Empty State Handling

- Navigate to an area with no reports (e.g., outskirts of Turin).
- **Verify that**:
  - The sidebar shows "No reports in this area" message.
  - The counter shows "Reports found: 0".
  - The helpful text "Move the map to find more" is displayed.

### Test 13: Report Details Modal

- Click on a report pin popup.
- Click "Show Details" button.
- **Verify that**:
  - The popup closes.
  - The sidebar closes (if open).
  - A detailed report modal opens with full report information.
  - The modal can be closed properly.

### Test 14: Different Report Submission Outcomes

- **Test Success Case**: Follow Test 7 for successful submission.
- **Test Failure Case**:
  - Disconnect from internet or use invalid data.
  - Attempt to submit a report.
  - **Verify that**: A failure modal appears with error message.

### Test 15: Address Resolution

- Click on a valid location inside Turin.
- **Verify that**:
  - The form opens with coordinates.
  - An address is automatically resolved and displayed (may take a few seconds).
  - If address resolution fails, coordinates are still available.

### Test 16: Mobile vs Desktop Animation Differences

- **Desktop**: Click on a location inside Turin.
  - **Verify**: Map centers with left offset to accommodate the sidebar.
- **Mobile**: Resize window to mobile width, click on a location.
  - **Verify**: Map centers with bottom offset to accommodate mobile form.

### Test 17: Submit Anonymous Report
- **Pre-condition**: Logged in as Citizen.
- Click on a valid location on the map.
- In the report form, find the "Submit Anonymously" toggle.
- Switch it to **ON**.
- Fill in the rest of the form (Title, Description, Category, Photo).
- Click "Submit Report".
- **Verify that**:
  - Success message appears.
  - The new report appears in the sidebar list.
  - The author name in the sidebar card is displayed as **"Anonymous"**.
  - The user icon in the card is an anonymous user icon (crossed out user).
