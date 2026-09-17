# Manual Testing Document: AdminPage

## Purpose
This document outlines manual tests for the `AdminPage`, focusing on visual verification, user interaction, and data flows that are not fully covered by automated tests.

### Pre-conditions
- Log in as an Administrator.
- Navigate to the Admin Page.

---

### Test 1: Visual Layout and Component Rendering
- **Objective:** Verify that all UI elements on the Admin Page are displayed correctly.
- **Steps:**
  1. Load the Admin Page.
  2. **Verify:**
     - The main title "Admin Page" is visible.
     - The "Set Up User" button is present and clickable.
     - The search bar is displayed with the placeholder "Search by name, surname, or email".
     - The role legend (Administrator, Project Manager, Technician, Unassigned) is clear and visible.
     - The list of user cards is rendered below the search bar.

---

### Test 2: User Loading and Display
- **Objective:** Ensure that users are fetched and displayed correctly in user cards.
- **Steps:**
  1. On the Admin Page, observe the user list.
  2. **Verify:**
     - A list of user cards is displayed.
     - Each card shows the user's name, surname, and email.
     - Each card displays the correct role icon corresponding to the user's role.

---

### Test 3: Search Functionality
- **Objective:** Verify that the search bar correctly filters the user list.
- **Steps:**
  1. Identify a unique user in the list (e.g., with a unique name).
  2. Type the user's name into the search bar.
  3. **Verify:**
     - The user list filters in real-time.
     - Only the user(s) matching the search query are displayed.
  4. Clear the search bar.
  5. **Verify:**
     - The full list of users is displayed again.
  6. Perform a search that yields no results (e.g., type "xyz").
  7. **Verify:**
     - A "No users found" message is displayed.

---

### Test 4: "Set Up User" Modal Flow
- **Objective:** Verify that the "Set Up User" button correctly opens the modal for creating a new user.
- **Steps:**
  1. Click the "Set Up User" button.
  2. **Verify:**
     - The `SetUpUserModal` opens correctly.
     - The modal title is "Set Up New User".
  3. Close the modal using the close button.
  4. **Verify:**
     - The modal closes, and the Admin Page is visible again.

### Test 5: Filter Users by Role
- **Objective:** Verify filtering by specific roles.
- **Steps:**
  1. Click on a role filter chip (e.g., "Street Maintenance Operator").
  2. **Verify:**
     - The chip becomes active/highlighted.
     - The user list updates to show only users with that role.
     - The count reflects the filtered number.
  3. Click the same filter again.
  4. **Verify:**
     - The filter is deselected.
     - The list resets.

### Test 6: Assign Technical Roles (Multi-select)
- **Objective:** Verify assigning multiple technical roles to a user.
- **Steps:**
  1. Identify a user with no roles or "Unsigned" role.
  2. Click the "Add Role" (plus icon) button on the user card.
  3. **Verify:** `RoleAssignmentModal` opens.
  4. Select multiple technical roles (e.g., "Street Maintenance Operator" AND "Waste Management Operator").
  5. **Verify:** Both roles are highlighted.
  6. Click "Save" or "Add Role".
  7. **Verify:**
     - The modal closes.
     - The user card now displays both new role badges.

### Test 7: Assign Exclusive Role (PRO/Admin)
- **Objective:** Verify assigning exclusive roles handles existing roles correctly.
- **Steps:**
  1. Open the Role Assignment Modal for a user.
  2. Select "Public Relations Officer".
  3. **Verify:** Any previously selected roles are automatically deselected.
  4. Click "Save".
  5. **Verify:** The user now has ONLY the PRO role.

### Test 8: Assign External Maintainer (Company Selection)
- **Objective:** Verify the flow for assigning an External Maintainer role.
- **Steps:**
  1. Open the Role Assignment Modal for a user.
  2. Select "External Maintainer".
  3. Click "Save" (or proceed to next step).
  4. **Verify:** The view changes to "Select Company".
  5. Select a company from the list.
  6. **Verify:**
     - The modal closes.
     - The user card shows "External Maintainer" role.

### Test 9: Remove Roles (Reset All)
- **Objective:** Verify removing all roles from a user.
- **Steps:**
  1. Open the Role Assignment Modal for an assigned user.
  2. Click "Reset All".
  3. **Verify:**
     - All roles are removed.
     - The user card shows "Unassigned" (or empty role list).

### Test 10: Disable User
- **Objective:** Verify the user disable flow.
- **Steps:**
  1. Click on a User Card to open User Details.
  2. Click "Disable User".
  3. **Verify:** A confirmation modal appears.
  4. Confirm the action.
  5. **Verify:** User status updates to "DEACTIVATED".
