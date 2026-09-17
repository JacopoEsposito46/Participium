# Participium Frontend

This is the frontend application for the Participium platform, a civic engagement system that allows citizens to report issues and track their resolution.

## Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

## Installation

To install all the required dependencies, run:

```bash
npm install
```

## Running the Application

To start the development server, run:

```bash
npm run dev
```

The application will be available at the local address shown in your terminal (typically `http://localhost:5173`).

## Testing

This project uses Vitest for unit and component testing.

To run tests:

```bash
npm test
```

## Backend Dependency

This frontend application is designed to work in conjunction with the **participium-backend** project. Make sure the backend server is running before using this application to ensure full functionality.

## Technologies Used

- React
- React Router
- Bootstrap
- Leaflet (for map functionality)
- Vite (build tool)
- Vitest (testing framework)

## Features

### Public & Citizens
- Interactive Map: View approved reports on a zoomable map. Reports are clustered at high levels and detailed when zoomed in.

- Search: Search locations by address.

- Registration: Sign up with name and username, verified via an email code.
  
- Report Issues: Create reports by selecting a location on the map, adding details (title, description, category), and uploading photos.

- Privacy: Option to submit reports anonymously.

- Profile Management: Configure personal details and preferences.

### Administration & Internal Staff
- System Administration: Create municipality accounts and manage user roles (including multiple roles per user).

- Report Moderation (PRO): Public Relations Officers can review, approve, or reject submitted reports.

- Maintenance Management: Technical Office Staff can view assigned reports and delegate them to external maintainers.

- Intervention Tracking: External Maintainers can update/suspend the status of assigned reports.

- Internal Collaboration: Technical Staff and Maintainers can exchange private comments on reports.