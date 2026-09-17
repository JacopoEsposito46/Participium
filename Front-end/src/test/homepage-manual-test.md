# Manual Testing Document: Homepage

## Homepage Test

### Purpose
Verify that the landing page displays correctly, features are visible, and navigation actions work as expected based on user authentication state.

### Components involved
- Hero Section (Title, Subtitle, Image)
- Features Section (List of key features)
- Info Section (Details about georeferencing)
- CTA Section (Call to Action buttons)
- Floating Scroll Button

### Test 1: Visual Verification (Logged Out)
- **Pre-condition**: User is NOT logged in.
- Open the root URL (`/`).
- **Verify that**:
  - The Hero section displays "Participate in improving your city".
  - The features cards (Report Issues, Add Details, Municipal Management, Track Status) are visible.
  - The CTA button in the bottom section says "Sign Up for Free".

### Test 2: Navigation - Sign Up (Logged Out)
- **Pre-condition**: User is NOT logged in.
- Click the "Sign Up for Free" button in the CTA section.
- **Verify that**:
  - The user is redirected to the `/register` page.

### Test 3: Navigation - Go to Map (Logged In)
- **Pre-condition**: User is logged in as a Citizen.
- Open the root URL (`/`).
- **Verify that**:
  - The CTA button in the bottom section says "Go to the Map".
- Click the "Go to the Map" button.
- **Verify that**:
  - The user is redirected to the `/map` page.

### Test 4: Scroll Button Behavior
- Open the Homepage.
- **Verify that**:
  - A floating arrow button is visible at the bottom right.
- Click the floating arrow button.
- **Verify that**:
  - The page scrolls smoothly to the bottom.
- Manually scroll to the very bottom of the page.
- **Verify that**:
  - The floating button fades out or disappears when the bottom is reached.

### Test 5: Mobile Responsiveness
- Resize the browser window to mobile width (< 768px).
- **Verify that**:
  - The Features cards stack vertically instead of horizontally.
  - The text in the Hero section remains readable and properly aligned.
