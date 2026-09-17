# Manual Testing Document: Registration

## Registration Test

### Purpose
Verify that users can register correctly and that the system handles errors and edge cases.

### Components involved
- Registration form (name, surname, username, email, password)
- Register button
- Error modal
- Navigation to login page

### Test 1: Registration with valid data
- Open the registration page.
- Fill all fields with valid data (e.g., name: "Mario", surname: "Rossi", username: "mario123", email: "mario@example.com", password: "password123").
- Click the "Register" button.
- Verify that:
  - The system shows a loading indicator ("Registering...").
  - An "Email Verification" modal appears.
  - The modal displays the registered email.

### Test 2: Enter valid verification code
- *Prerequisite*: Registration form submitted, Verification Modal open.
- Enter a valid 6-digit code (simulated).
- Click "Verify Email".
- Verify that:
  - Success message appears ("Email verified successfully!").
  - User is automatically logged in.
  - User is redirected to the "How it Works" page (`/how-it-works`).

### Test 3: Enter invalid verification code
- *Prerequisite*: Verification Modal open.
- Enter an invalid code (e.g., "000000").
- Click "Verify Email".
- Verify that:
  - An error alert appears ("Verification failed...").
  - The modal remains open.
  - User is NOT logged in.

### Test 4: Resend verification code
- *Prerequisite*: Verification Modal open.
- Click "Resend Code".
- Verify that:
  - Button changes to "Sending...".
  - Success message appears ("Verification code sent successfully!").
  - Cooldown timer starts (button disabled with countdown).

### Test 5: Registration with incomplete data
- Open the registration page.
- Fill only some fields (e.g., name and surname, leaving username, email, or password empty).
- Click the "Register" button.
- Verify that:
  - The browser shows an HTML5 error message (required field).
  - The form is not submitted.

### Test 6: Registration with invalid email
- Open the registration page.
- Fill all fields, but enter an invalid email (e.g., "mario").
- Click the "Register" button.
- Verify that:
  - The browser shows an HTML5 error message (email format).
  - The form is not submitted.

### Test 7: Registration with too short password
- Open the registration page.
- Fill all fields, but enter a password with less than 6 characters.
- Click the "Register" button.
- Verify that:
  - The browser shows an HTML5 error message (minimum length).
  - The form is not submitted.

### Test 8: Registration with already existing data
- Open the registration page.
- Fill all fields with already registered data (e.g., email already used).
- Click the "Register" button.
- Verify that:
  - The system shows a loading indicator.
  - After the attempt, the error modal appears with the appropriate message.
  - The user remains on the registration page.

### Test 9: Close Verification Modal
- *Prerequisite*: Verification Modal open.
- Click the Close (X) button on the modal.
- Verify that:
  - The modal closes.
  - User is redirected to the Login page (`/login`).

### Test 10: Navigation via link
- Open the registration page.
- Click the "login" link in "If you already have an account, login".
- Verify that:
  - The user is redirected to the login page.
