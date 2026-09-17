# Manual Testing Document: User Page (Profile)

## User Profile Test

### Purpose
Verify that the user can view their profile, update their personal information, and see their submitted reports history.

### Components involved
- Profile Info Form (First Name, Last Name, Email, Username, Telegram, Notifications)
- Profile Photo
- Edit/Save/Cancel Buttons
- Report History List

### Test 1: View Profile (Read-Only Mode)
- Navigate to `/profile`.
- **Verify that**:
  - All input fields are grayed out/read-only.
  - The "Edit Profile" (pencil icon) button is visible near the title.
  - The user's current data is correctly populated.

### Test 2: Edit Profile and Save
- Click the "Edit Profile" button.
- **Verify that**:
  - Fields become editable (white background).
  - "Cancel" and "Save" buttons appear at the bottom of the form.
  - A camera icon appears over the profile photo allowing upload.
- Modify the "First Name" or "Telegram Username".
- Toggle "Email Notifications".
- Click "Save".
- **Verify that**:
  - A success message "Profile updated successfully!" appears.
  - The form reverts to read-only mode.
  - The new values are persisted.

### Test 3: Photo Upload
- Click "Edit Profile".
- Click the camera icon on the profile image.
- Select a valid image file (JPG/PNG).
- **Verify that**:
  - A local preview of the new image is shown immediately.
- Click "Save".
- **Verify that**:
  - The new image is saved and displayed after the loading state.

### Test 4: Cancel Editing
- Click "Edit Profile".
- Change some fields (e.g., clear the Last Name).
- Click "Cancel".
- **Verify that**:
  - The form reverts to read-only mode.
  - The original values are restored (Last Name is back to original).

### Test 5: Report History
- Scroll to the "Your Reports" section.
- **Verify that**:
  - A list of reports submitted by the user is displayed.
  - Each report card shows status, title, and date.
  - Clicking a report card opens the detail modal for that report.

### Test 6: Critical Flow - Email Change
- Click "Edit Profile".
- Change the email address to a new valid email.
- Click "Save".
- **Verify that**:
  - The user is immediately logged out (redirected to `/login`).
  - Attempting to navigate back to `/profile` redirects to `/login`.

### Test 7: Input Validation
- Click "Edit Profile".
- Clear the "First Name" field.
- Click "Save".
- **Verify that**:
  - The browser's native validation prevents submission (if `required` attribute exists), OR
  - An error message indicating the field is required appears.

### Test 8: Empty State (New User)
- Login with a newly registered user who hasn't submitted reports.
- Navigate to `/profile`.
- **Verify that**:
  - The report list section displays "You haven't submitted any reports yet." instead of an empty list.
