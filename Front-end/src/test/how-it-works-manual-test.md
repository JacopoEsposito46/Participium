# Manual Testing Document: How It Works

## How It Works Test

### Purpose
Verify the informational page that explains the reporting process to the user.

### Components involved
- Header section
- Steps visualization (Icon, Number, Description)
- "Start Reporting" button

### Test 1: Visual Verification
- Open the `/how-it-works` page.
- **Verify that**:
  - The title "Welcome to PARTICIPIUM!" is displayed.
  - Four distinct steps are shown with icons and numbers (1, 2, 3, 4).
  - The descriptions for each step (Locate, Fill, Submit, Track) are readable.

### Test 2: Navigation to Map
- Click the "Start Reporting" button at the bottom of the page.
- **Verify that**:
  - The user is redirected to the `/map` page.

### Test 3: Responsive Behavior
- Resize the browser window to mobile width.
- **Verify that**:
  - The step cards (1-4) stack vertically.
  - The "Start Reporting" button remains easily clickable.
