# Manual Testing Document: UserCard

## Purpose
This document outlines manual tests for the `UserCard` component, focusing on visual verification and user interaction flows that are not fully covered by automated tests.

### Pre-conditions
- Navigate to the admin page where user cards are displayed.
- Ensure there are users with assigned roles and at least one unassigned user.

---

### Test 1: Visual Verification of User Information and Role Icons
- **Objective:** Verify that user cards display information clearly and role icons are visually correct.
- **Steps:**
  1. Locate a user card for a user with an assigned role (e.g., "Project Manager").
  2. **Verify:**
     - The user's name, surname, and email are correctly displayed and readable.
     - The role icon (e.g., Project Manager icon) is visually correct and matches the legend.
  3. Locate a card for an unassigned user.
  4. **Verify:**
     - The "Unassigned" icon is displayed.
     - A plus icon (+) is visible to allow role assignment.

---

### Test 2: Full Role Assignment Flow
- **Objective:** Verify the complete user flow for assigning a role to an unassigned user.
- **Steps:**
  1. Locate an unassigned user card.
  2. Click the add button (+).
  3. **Verify:**
     - The "Assign Role" modal opens correctly, showing the user's full name.
  4. Select a role from the modal (e.g., "Technician").
  5. **Verify:**
     - The modal closes automatically after selection.
     - The user card on the admin page updates to show the new role icon ("Technician").
  6. Refresh the page.
  7. **Verify:**
     - The user's role is persisted, and the "Technician" icon is still displayed.

---

### Test 3: Modal Closure without Assignment
- **Objective:** Ensure the role assignment modal can be closed without assigning a role.
- **Steps:**
  1. Open the role assignment modal for an unassigned user.
  2. Click the close button (×) on the modal.
  3. **Verify:**
     - The modal closes.
     - The user card remains unchanged, and the user is still "Unassigned".
