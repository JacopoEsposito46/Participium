# Manual Testing Document: RoleAssignmentModal

## Purpose
This document outlines manual tests for the `RoleAssignmentModal`, focusing on the user interaction flow and visual feedback when assigning a role.

### Pre-conditions
- Log in as an Administrator.
- Navigate to the Admin Page.
- Ensure there is at least one "Unassigned" user.

---

### Test 1: Modal Opening and Content Display
- **Objective:** Verify that the modal opens correctly and displays the right information.
- **Steps:**
  1. Locate an "Unassigned" user card and click the plus icon (+).
  2. **Verify:**
     - The `RoleAssignmentModal` opens.
     - The modal title is "Assign Role".
     - The subtitle correctly displays the full name of the selected user.
     - A list of available roles (e.g., "Project Manager", "Technician") is visible and clickable.

---

### Test 2: Role Assignment and Modal Closure
- **Objective:** Verify that selecting a role triggers the assignment and closes the modal.
- **Steps:**
  1. Open the `RoleAssignmentModal` for an unassigned user.
  2. Click on one of the available roles (e.g., "Project Manager").
  3. **Verify:**
     - The modal closes automatically upon selection.
     - The user card on the Admin Page updates to show the new role icon for that user.

---

### Test 3: Closing the Modal Without Assignment
- **Objective:** Ensure the modal can be closed without changing the user's role.
- **Steps:**
  1. Open the `RoleAssignmentModal` for an unassigned user.
  2. Click the close button (×) at the top-right of the modal.
  3. **Verify:**
     - The modal closes.
     - The user's role remains "Unassigned".
