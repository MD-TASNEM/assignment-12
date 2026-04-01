# 🧪 API Testing Guide

## 📡 Base URL

```
Development: http://localhost:3000
Production: https://your-domain.com
```

## 🔐 Authentication

All protected endpoints require:

```
Authorization: Bearer <token>
```

Token is received after login/register and should be sent in the `Authorization` header.

---

## 👤 Authentication Endpoints

### 1. Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "01700000000",
  "nid": "1234567890",
  "password": "TestPass123",
  "confirmPassword": "TestPass123"
}
```

**Response (201):**

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "01700000000"
  }
}
```

### 2. Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "TestPass123"
}
```

**Response (200):**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "01700000000",
    "role": "user"
  }
}
```

---

## 🏥 Service Endpoints

### 1. Get All Services

```http
GET /api/services
```

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Baby Care & Babysitting",
    "slug": "baby-care-and-babysitting",
    "description": "Professional babysitting services...",
    "category": "baby-care",
    "serviceCharge": 500,
    "features": ["Experienced caregivers", ...],
    "rating": 4.8,
    "reviews": 250,
    "isActive": true
  }
]
```

### 2. Get Single Service

```http
GET /api/services?id=SERVICE_ID
```

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Baby Care & Babysitting",
  ...
}
```

### 3. Filter Services by Category

```http
GET /api/services?category=baby-care
```

**Categories:**

- `baby-care`
- `elderly-service`
- `sick-care`

---

## 📅 Booking Endpoints

### 1. Create Booking

```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "serviceId": "507f1f77bcf86cd799439011",
  "duration": 3,
  "startDate": "2024-04-15T10:00:00Z",
  "location": {
    "division": "Dhaka",
    "district": "Dhaka",
    "city": "Dhaka",
    "area": "Dhanmondi",
    "address": "123 Main Street, Apt 4B"
  }
}
```

**Response (201):**

```json
{
  "message": "Booking created successfully",
  "booking": {
    "_id": "507f1f77bcf86cd799439011",
    "bookingId": "CARE-1712051840000-abc123def",
    "userId": "507f1f77bcf86cd799439011",
    "serviceId": "507f1f77bcf86cd799439011",
    "serviceName": "Baby Care & Babysitting",
    "duration": 3,
    "startDate": "2024-04-15T10:00:00Z",
    "location": {...},
    "serviceCharge": 500,
    "totalCost": 1500,
    "status": "Pending",
    "paymentStatus": "Unpaid",
    "invoiceSent": true
  }
}
```

### 2. Get User Bookings

```http
GET /api/bookings
Authorization: Bearer <token>
```

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "bookingId": "CARE-1712051840000-abc123def",
    "serviceName": "Baby Care & Babysitting",
    "duration": 3,
    "totalCost": 1500,
    "status": "Pending",
    "paymentStatus": "Unpaid"
  }
]
```

### 3. Get Single Booking

```http
GET /api/bookings?id=BOOKING_ID
Authorization: Bearer <token>
```

### 4. Update Booking Status

```http
PUT /api/bookings?id=BOOKING_ID
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Confirmed"
}
```

**Valid Statuses:** `Pending`, `Confirmed`, `Completed`, `Cancelled`

### 5. Cancel Booking

```http
DELETE /api/bookings?id=BOOKING_ID
Authorization: Bearer <token>
```

---

## 💳 Payment Endpoints

### 1. Create Payment Intent

```http
POST /api/payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": "507f1f77bcf86cd799439011",
  "amount": 1500
}
```

**Response (201):**

```json
{
  "message": "Payment intent created",
  "clientSecret": "pi_123456_secret_abcdef",
  "payment": {
    "_id": "507f1f77bcf86cd799439011",
    "bookingId": "507f1f77bcf86cd799439011",
    "amount": 1500,
    "status": "pending",
    "stripePaymentIntentId": "pi_123456"
  }
}
```

### 2. Get User Payments

```http
GET /api/payments
Authorization: Bearer <token>
```

### 3. Get Payment for Booking

```http
GET /api/payments?bookingId=BOOKING_ID
Authorization: Bearer <token>
```

### 4. Update Payment Status

```http
PATCH /api/payments?id=PAYMENT_ID
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

**Valid Statuses:** `pending`, `completed`, `failed`, `refunded`

---

## 👨‍💼 Admin Endpoints

### 1. Dashboard Stats

```http
GET /api/admin/dashboard?type=dashboard
Authorization: Bearer <token>
x-user-role: admin
```

**Response (200):**

```json
{
  "stats": {
    "totalBookings": 45,
    "totalPayments": 38,
    "totalUsers": 120,
    "totalRevenue": 45000
  },
  "recentBookings": [...]
}
```

### 2. Get All Bookings

```http
GET /api/admin/dashboard?type=bookings
Authorization: Bearer <token>
x-user-role: admin
```

### 3. Get Payment History

```http
GET /api/admin/dashboard?type=payments
Authorization: Bearer <token>
x-user-role: admin
```

### 4. Update Booking Status (Admin)

```http
POST /api/admin/dashboard
Authorization: Bearer <token>
x-user-role: admin
Content-Type: application/json

{
  "action": "update-booking-status",
  "bookingId": "507f1f77bcf86cd799439011",
  "status": "Confirmed"
}
```

---

## 🧪 Example Complete User Flow

### Step 1: Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "01712345678",
    "nid": "9876543210",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  }'
```

### Step 2: Get Services

```bash
curl -X GET http://localhost:3000/api/services
```

### Step 3: Get Single Service

```bash
curl -X GET http://localhost:3000/api/services?id=SERVICE_ID
```

### Step 4: Create Booking (with token from Step 1)

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "SERVICE_ID",
    "duration": 2,
    "startDate": "2024-04-20T14:00:00Z",
    "location": {
      "division": "Dhaka",
      "district": "Dhaka",
      "city": "Dhaka",
      "area": "Gulshan",
      "address": "456 Park Avenue"
    }
  }'
```

### Step 5: Create Payment

```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "BOOKING_ID",
    "amount": 1000
  }'
```

### Step 6: Update Payment

```bash
curl -X PATCH http://localhost:3000/api/payments?id=PAYMENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

---

## ❌ Error Responses

### 400 Bad Request

```json
{
  "message": "All fields are required"
}
```

### 401 Unauthorized

```json
{
  "message": "Unauthorized"
}
```

### 404 Not Found

```json
{
  "message": "Booking not found"
}
```

### 409 Conflict

```json
{
  "message": "User already exists with this email or NID"
}
```

### 500 Internal Server Error

```json
{
  "message": "Internal server error",
  "error": "Error details..."
}
```

---

## 🛠️ Testing with Postman

1. Create new collection
2. Set base URL: `{{baseUrl}}/api`
3. Add variable: `baseUrl` = `http://localhost:3000`
4. Create requests for each endpoint
5. Use pre-request scripts to set Authorization header

**Pre-request Script Example:**

```javascript
pm.globals.set("token", pm.response.json().token);
```

**Authorization Header:**

```
Bearer {{token}}
```

---

## 💡 Tips

- Save token after login for subsequent requests
- Use Postman environment variables
- Test error cases (missing fields, invalid IDs)
- Verify email sending in development
- Check MongoDB records after booking
- Test payment flow with test cards

---

**Ready to test? Start with registration!** 🚀
