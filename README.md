# JWT Auth API

This is a simple and modular Node.js + Express API that uses JWT for authentication. It supports access and refresh tokens, token blacklisting, role-based access (e.g., admin-only routes), and centralized error handling.

## Tech Stack

- Node.js & Express
- MongoDB with Mongoose
- JWT for authentication
- `http-status-codes` for cleaner status responses
- Custom error middleware for centralized error handling
- Environment variables managed with `dotenv`

## Features

- User login with access and refresh tokens
- Access token expires in 15 minutes
- Refresh token expires in 7 days
- Refresh route to generate new access tokens
- Logout route that:
  - Deletes the refresh token
  - Blacklists the current access token
- Middleware for:
  - Verifying access tokens
  - Verifying refresh tokens
- Role-based route protection (admin)
- Centralized error handling middleware
- 404 Not Found middleware
- Consistent status codes using `http-status-codes`
- Helpful error messages for debugging

## .env Configuration

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_TOKEN_KEY=your_access_token_secret
JWT_REFRESH_KEY=your_refresh_token_secret
```

## API Endpoints

### POST `/api/v1/login`

Logs in a user and returns access & refresh tokens.

**Request Body:**

```json
{
  "username": "john",
  "password": "123456"
}
```

**Response:**

```json
{
  "message": "user john is now logged in",
  "accessToken": "your_access_token_here",
  "refreshToken": "your_refresh_token_here"
}
```

### POST `/api/v1/refresh`

Generates a new access token using a valid refresh token.

**Request Body:**

```json
{
  "refreshToken": "your_refresh_token_here"
}
```

**Response:**

```json
{
  "user": "john",
  "message": "Your new access token is generated.",
  "token": "new_access_token_here"
}
```

### GET `/api/v1/dashboard`

Protected route. Requires a valid access token.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```
Hello john your luckyNumber is: 42
```

### GET `/api/v1/admin`

Admin-only route. Requires a valid access token with the `admin` role.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (if admin):**

```json
{
  "message": "This is the admin dashboard"
}
```

### DELETE `/api/v1/logout`

Logs out a user by blacklisting their token and removing the refresh token.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "message": "Logged out successfully"
}
```

## Error Handling

The app uses custom error classes for better control and debugging:

- `BadRequestError`
- `UnauthorizedError`
- `NotFoundError`
- `CustomAPIError`

All errors go through centralized error-handling middleware, which sends back consistent JSON responses.

## 404 Middleware

Requests to unknown routes return a `404 Not Found` response with a clean JSON message.

## Notes

- Access and refresh tokens are signed with secrets from the `.env` file.
- Refresh tokens are stored in the database.
- Blacklisted tokens are checked on every protected route.
- Admin-only routes are protected by both token verification and role-checking logic.

## Example Usage

1. Login to get access and refresh tokens.
2. Use the access token to access protected routes like `/dashboard`.
3. Use the refresh token to generate a new access token before expiry.
4. Use the logout route to invalidate both tokens.