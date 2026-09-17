# Manual Testing Document: Login

## Login Test

### Purpose
Verify that users can log in correctly and that the system handles errors and edge cases.

### Components involved
- Login form (email, password)
- Login button
- Error modal
- Navigation to map page

### Test 1: Login with correct credentials
- Open the login page.
- Enter correct email and password.
- Click the "Login" button.
- Verify that:
  - The system shows a loading indicator ("Logging in...").
  - After completion, the user is redirected to the map page.
  - The authentication token is saved in localStorage.

### Test 2: Login with incorrect credentials
- Open the login page.
- Enter incorrect email or password.
- Click the "Login" button.
- Verify that:
  - The system shows a loading indicator.
  - After the attempt, the error modal appears with the appropriate message.
  - The user remains on the login page.

### Test 3: Login with empty fields
- Open the login page.
- Leave email or password empty.
- Click the "Login" button.
- Verify that:
  - The browser shows an HTML5 error message (required field).
  - The form is not submitted.

### Test 4: Login with invalid email
- Open the login page.
- Enter an invalid email (e.g., "mario").
- Click the "Login" button.
- Verify that:
  - The browser shows an HTML5 error message (email format).
  - The form is not submitted.

### Test 5: Login with too short password
- Open the login page.
- Enter a password with less than 6 characters.
- Click the "Login" button.
- Verify that:
  - The browser shows an HTML5 error message (minimum length).
  - The form is not submitted.

### Test 6: Closing the error modal
- Reproduce a login error (e.g., incorrect credentials).
- Click the "Close" button on the error modal.
- Verify that:
  - The modal disappears.
  - The data entered in the form is still present.

### Test 7: Navigation via link
- Open the login page.
- Click the "register" link in "If you don't have an account, register".
- Verify that:
  - The user is redirected to the registration page.
