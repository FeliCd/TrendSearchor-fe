# User Registration API Documentation

This document describes the payload and validation requirements for the user registration endpoint (`POST /api/auth/register`).

## Endpoint
**POST** `/api/auth/register` (or equivalent, as defined in `authService.js`)

## Request Payload (JSON)

The front-end sends a JSON object with the following fields:

| Field | Type | Description | Validation Requirements (Frontend sync) |
| --- | --- | --- | --- |
| `fullName` | String | The user's full name. | Required, minimum 3 characters. |
| `mail` | String | The user's email address. | Required, valid email format. |
| `password` | String | The chosen password. | Required, minimum 9 characters, at least 1 uppercase letter, 1 number, and 1 special character. |
| `confirmPassword` | String | Confirmation of password. | Required, must exactly match `password`. (The backend may optionally ignore this if validation is strictly on frontend). |
| `phone` | String | The user's phone number. | Required, exactly 10 digits starting with '09', '03', '05', '07', or '08'. |
| `dob` | String | Date of birth. | Required, format `YYYY-MM-DD`. Must be in the past and year >= 1920. |
| `gender` | Enum String | The user's gender. | Required. Accepted values: `"MALE"`, `"FEMALE"`, `"OTHERS"`. |
| `workplace` | String | Workplace or University. | Required. |
| `role` | Enum String | The user's selected account type. | Required. Accepted values: `"STUDENT"`, `"RESEARCHER"`. |

### Example Request Body
```json
{
  "fullName": "John Doe",
  "mail": "johndoe@university.edu",
  "password": "Password@123",
  "confirmPassword": "Password@123",
  "phone": "0912345678",
  "dob": "1998-05-15",
  "gender": "MALE",
  "workplace": "FPT University",
  "role": "STUDENT"
}
```

## Response Specifications

### Success Response
- **HTTP Status Code**: `201 Created` or `200 OK`
- **Body**: Any structure (the frontend currently just relies on a non-error status to show the success message and redirect to login).

### Error Response (Validation Failure)
- **HTTP Status Code**: `400 Bad Request`
- **Body**: The frontend handles field-level errors by expecting a JSON object where keys correspond to field names and values are the error messages.
  
#### Example 400 Bad Request Payload:
```json
{
  "mail": "Email already exists in the system.",
  "phone": "Phone number is invalid or registered."
}
```
*(If the error is not a field mapping, the frontend expects a standard error message in `err.response.data.message` or similar).*

## Integration Notes
- The front-end expects social registration (Google, ORCID) to eventually use a different mechanism (e.g., OAuth redirects) or separate endpoints, which will be implemented later.
- Make sure to sanitize and securely hash the `password` using standard practices (e.g., bcrypt/Argon2) before storing it in the database.
