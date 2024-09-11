
# React Member Management App

This React application provides a member management interface, including authentication, member creation, listing, updating, and deletion. The app interacts with a backend service via RESTful APIs, handling JWT-based authentication and error management.

## Table of Contents

- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Features](#features)
- [Pages and Components](#pages-and-components)
- [API Integration](#api-integration)
- [Error Handling](#error-handling)
- [Usage](#usage)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/sijosaji/kitchensink-ui.git
   cd kitchensink-ui
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the app:**

   ```bash
   npm start
   ```

## Available Scripts

In the project directory, you can run:

- `npm start` - Runs the app in the development mode.
- `npm test` - Launches the test runner.
- `npm run build` - Builds the app for production.

## Features

- **User Authentication**: Login and registration with JWT token management.
- **Member Management**: Create, list, update, and delete members.
- **Form Validation**: Client-side validation for member data.
- **Error Handling**: Graceful handling of API errors, including token expiration, validation errors, and rate limiting.

## Pages and Components

### `App.js`

- The main entry point of the application.
- Handles routing between `LoginPage`, `RegisterPage`, and `Dashboard`.
- Manages JWT tokens in `localStorage`.

### `Dashboard.js`

- Main component for managing members.
- Allows users to add new members and lists all existing members.
- Utilizes the `MemberTable` component to display members.

### `MemberTable.js`

- Displays a table of members with options to edit or delete.
- Integrates modals for editing and deleting members.
- Fetches member data using the `fetchMembers` function.

### `ErrorModal.js`

- A reusable component for displaying error messages.
- Used across various components to handle and show API errors.

## API Integration

The app integrates with backend services using `axios`:

### Auth API

- Base URL: `http://localhost:9000/auth`
- Handles user authentication and registration.

### Member API

- Base URL: `http://localhost:8080/kitchensink/rest`
- Handles CRUD operations for members.

### Axios Interceptors

- **Request Interceptor**: Adds the `Authorization` header with the JWT token for `memberApi` requests.
- **Response Interceptor**: Handles token refresh on `401` errors and reattempts the original request.

### API Functions

- `login(credentials)` - Authenticates a user and retrieves tokens.
- `register(userData)` - Registers a new user.
- `createMember(memberData)` - Creates a new member.
- `listMembers()` - Fetches all members.
- `getMember(id)` - Fetches details of a specific member.
- `updateMember(id, memberData)` - Updates a member's details.
- `deleteMember(id)` - Deletes a member.

## Error Handling

- **401 Unauthorized**: Redirects the user to the login page.
- **429 Too Many Requests**: Displays a retry-after message.
- **400/409 Bad Request/Conflict**: Displays validation errors returned by the backend.

## Usage

1. **Login**: Access the login page at `/login`. After successful login, you will be redirected to the dashboard.
2. **Register**: New users can register at `/register`. After registration, the user can log in with their credentials.
3. **Manage Members**: On the dashboard, users can add, edit, or delete members.
4. **Logout**: Users can log out using the logout button, which clears the JWT tokens from `localStorage`.