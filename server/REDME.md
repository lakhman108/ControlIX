# ControlX API Documentation

## Table of Contents
- [Authentication](#authentication)
- [User Routes](#user-routes)
- [Device Routes](#device-routes)
- [Location Routes](#location-routes)
- [Role-Based Access](#role-based-access)
- [Response Formats](#response-formats)

## Authentication
All protected routes require a Bearer token in the Authorization header or token in cookies.

```bash
# Header format
Authorization: Bearer <your-jwt-token>
```

## User Routes
Base path: `/api/v1/user`

### Sign Up
**POST** `/api/v1/user/signup`

**Request Body:**
```json
{
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8082/api/v1/user/signup \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
    }
  }'
```

### Login
**POST** `/api/v1/user/login`

**Request Body:**
```json
{
  "user": {
    "email": "john@example.com",
    "password": "password123"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8082/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "email": "john@example.com",
      "password": "password123"
    }
  }'
```

### Email Verification
**GET** `/api/v1/user/verifyemail`

**Query Parameters:**
- `token`: Verification token
- `email`: User email

**cURL Example:**
```bash
curl -X GET "http://localhost:8082/api/v1/user/verifyemail?token=<verification-token>&email=john@example.com"
```

### Forgot Password
**POST** `/api/v1/user/forgot_password`

**Request Body:**
```json
{
  "user": {
    "email": "john@example.com"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8082/api/v1/user/forgot_password \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "email": "john@example.com"
    }
  }'
```

### Reset Password
**POST** `/api/v1/user/forgot_password_reset`

**Request Body:**
```json
{
  "user": {
    "email": "john@example.com",
    "password": "newpassword123",
    "token": "<reset-token>"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8082/api/v1/user/forgot_password_reset \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "email": "john@example.com",
      "password": "newpassword123",
      "token": "<reset-token>"
    }
  }'
```

### Update Profile (Protected)
**PUT** `/api/v1/user`

**Request Body:**
```json
{
  "user": {
    "name": "John Updated",
    "bio": "New bio"
  }
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:8082/api/v1/user \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "name": "John Updated",
      "bio": "New bio"
    }
  }'
```

### Delete Profile (Protected)
**DELETE** `/api/v1/user`

**cURL Example:**
```bash
curl -X DELETE http://localhost:8082/api/v1/user \
  -H "Authorization: Bearer <token>"
```

### Get Current User (Protected)
**GET** `/api/v1/user/me`

**cURL Example:**
```bash
curl -X GET http://localhost:8082/api/v1/user/me \
  -H "Authorization: Bearer <token>"
```

## Device Routes
Base path: `/api/v1/device`

### Add Device (Admin/Helper only)
**POST** `/api/v1/device`

**Request Body:**
```json
{
  "name": "Living Location Light",
  "location": "<location-id>",
  "deviceId": "device123",
  "deviceType": "Smart Bulb",
  "description": "Main light in living location",
  "organization": "<org-id>"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8082/api/v1/device \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Living Location Light",
    "location": "<location-id>",
    "deviceId": "device123",
    "deviceType": "Smart Bulb",
    "description": "Main light in living location",
    "organization": "<org-id>"
  }'
```

### Remove Device (Admin/Helper only)
**DELETE** `/api/v1/device`

**Request Body:**
```json
{
  "deviceId": "device123"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:8082/api/v1/device \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "device123"
  }'
```

### Update Device (Admin/Helper/Manager only)
**PUT** `/api/v1/device`

**Request Body:**
```json
{
  "deviceId": "device123",
  "name": "Updated Light Name",
  "location": "<new-location-id>",
  "description": "Updated description"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:8082/api/v1/device \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "device123",
    "name": "Updated Light Name",
    "location": "<new-location-id>",
    "description": "Updated description"
  }'
```

### Get Device by ID
**GET** `/api/v1/device/:deviceId`

**cURL Example:**
```bash
curl -X GET http://localhost:8082/api/v1/device/device123 \
  -H "Authorization: Bearer <token>"
```

### Get Devices by Organization
**GET** `/api/v1/device/organization/:orgId`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**cURL Example:**
```bash
curl -X GET "http://localhost:8082/api/v1/device/organization/<org-id>?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### Get Devices by Location
**GET** `/api/v1/device/location/:locationId`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**cURL Example:**
```bash
curl -X GET "http://localhost:8082/api/v1/device/location/<location-id>?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

## Location Routes
Base path: `/api/v1/location`

### Add Location
**POST** `/api/v1/location`

**Request Body:**
```json
{
  "name": "Living Location",
  "description": "Main living area",
  "organization": "<org-id>"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8082/api/v1/location \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Living Location",
    "description": "Main living area",
    "organization": "<org-id>"
  }'
```

### Remove Location
**DELETE** `/api/v1/location/:locationId`

**cURL Example:**
```bash
curl -X DELETE http://localhost:8082/api/v1/location/<location-id> \
  -H "Authorization: Bearer <token>"
```

### Update Location
**PUT** `/api/v1/location/:locationId`

**Request Body:**
```json
{
  "name": "Updated Living Location",
  "description": "Updated description"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:8082/api/v1/location/<location-id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Living Location",
    "description": "Updated description"
  }'
```

### Get Location
**GET** `/api/v1/location/:locationId`

**cURL Example:**
```bash
curl -X GET http://localhost:8082/api/v1/location/<location-id> \
  -H "Authorization: Bearer <token>"
```

### Get Locations by Organization
**GET** `/api/v1/location/organization/:orgId`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**cURL Example:**
```bash
curl -X GET "http://localhost:8082/api/v1/location/organization/<org-id>?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

## Role-Based Access
The API implements role-based access control with the following roles:

- **admin**: Full access to all endpoints
- **helper**: Can manage devices and locations
- **manager**: Can view and update devices
- **customer**: Limited access to view devices
- **newbie**: Default role for new users

## Response Formats
All endpoints return JSON responses with the following structure:

### Success Response
```json
{
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "error": "Error message",
  "statusCode": 400
}
```

## Development
To run the API locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start the server: `npm start`

## Environment Variables
Create a `.env` file with the following variables:
```env
PORT=8082
MONGODB_URI=mongodb://localhost:27017/controlx
JWT_SECRET=your_jwt_secret
```

## License
[MIT License](LICENSE)