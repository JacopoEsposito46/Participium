# API Helper Documentation

This document explains how to use the `request` helper function in `API.js` to create new API calls. The `request` function is a wrapper around the native `fetch` API that handles common tasks like authentication, header construction, and error handling.

## The `request` Function

The `request` function handles the underlying HTTP logic.

```javascript
const request = async (endpoint, options = {})
```

### Parameters

- **`endpoint`** (string): The API endpoint path (e.g., `"api/citizens/login"`). It is automatically appended to the `SERVER_URL`.
- **`options`** (object): Configuration object for the request.

### Options Object

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `method` | string | `"GET"` | HTTP method (GET, POST, PUT, DELETE, PATCH). |
| `body` | any | `null` | The data to be sent. If `contentType` is "application/json", this is automatically stringified. |
| `useAuth` | boolean | `true` | If `true`, automatically adds the `Authorization: Bearer <token>` header from local storage. |
| `contentType` | string | `"application/json"` | The Content-Type header. Set to `null` for multipart/form-data (file uploads). |
| `customErrorMap` | object | `{}` | A map of HTTP status codes to custom error messages. |
| `defaultErrorMessage`| string | `"Operation failed"` | Fallback error message if the server error cannot be parsed or mapped. |

## Examples

### 1. Simple GET Request (Authenticated)

By default, `request` uses GET and includes authentication.

```javascript
const getUserProfile = async () => {
  try {
    const data = await request("api/users/profile");
    return data;
  } catch (error) {
    console.error("Failed to fetch profile", error);
    throw error;
  }
};
```

### 2. POST Request (Public/No Auth)

For Login or Registration, you often need to disable authentication headers.

```javascript
const login = async (email, password) => {
  try {
    const response = await request("api/auth/login", {
      method: "POST",
      useAuth: false, // Don't send token
      body: { email, password },
      defaultErrorMessage: "Login failed"
    });
    return response;
  } catch (error) {
    // Handle error
    throw error;
  }
};
```

### 3. Request with Custom Error Mapping

You can map specific HTTP status codes to user-friendly messages.

```javascript
const updateUsername = async (newUsername) => {
  await request("api/users/username", {
    method: "PUT",
    body: { username: newUsername },
    customErrorMap: {
      409: "Username already taken", // Map 409 Conflict
      400: "Invalid username format" // Map 400 Bad Request
    },
    defaultErrorMessage: "Update failed"
  });
};
```

### 4. File Upload (Multipart)

When uploading files, set `contentType` to `null` so the browser can set the boundary automatically.

```javascript
const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  await request("api/users/avatar", {
    method: "POST",
    body: formData,
    contentType: null // Important for FormData
  });
};
```
