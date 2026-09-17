# Manual Testing Document: SetUpUserModal

## Purpose
This document outlines manual tests for the `SetUpUserModal`, focusing on the user flow for creating a new internal user.

### Pre-conditions
- Log in as an Administrator.
- Navigate to the Admin Page.

---

### Test 1: Modal Opening and Initial State
- **Objective:** Verify that the modal opens correctly with empty fields.
- **Steps:**
  1. On the Admin Page, click the "Set Up User" button.
  2. **Verify:**
     - The `SetUpUserModal` opens.
     - The modal title is "Set Up New User".
     - The input fields for "First Name", "Last Name", and "Email" are empty.
     - The "Set Up" button is present.

---

### Test 2: New User Creation Flow
- **Objective:** Verify the complete flow of creating a new user and seeing them in the user list.
- **Steps:**
  1. Open the `SetUpUserModal`.
  2. Fill in the form with valid data for a new user (e.g., "John", "Doe", "john.doe@example.com").
  3. Click the "Set Up" button.
  4. **Verify:**
     - The modal closes automatically.
     - A new user card for "John Doe" appears in the user list on the Admin Page.
     - The new user is initially "Unassigned".

---

### Test 3: Form Validation and Error Handling
- **Objective:** Verify that the form shows errors for invalid input.
- **Steps:**
  1. Open the `SetUpUserModal`.
  2. Click the "Set Up" button without filling in any fields.
  3. **Verify:**
     - The modal remains open.
     - Error messages are displayed for each required field.
  4. Enter an invalid email format (e.g., "invalid-email").
  5. Click "Set Up".
  6. **Verify:**
     - An error message indicating an invalid email is displayed.

---

### Test 4: Closing the Modal Without Creating a User
- **Objective:** Ensure the modal can be closed without submitting the form.
- **Steps:**
  1. Open the `SetUpUserModal`.
  2. Fill in some data but do not submit.
  3. Click the close button (×).
  4. **Verify:**
     - The modal closes.
     - No new user is added to the list.
