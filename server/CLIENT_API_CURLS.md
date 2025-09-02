# IMVEST Client API cURL Commands

## Base URL
```
http://localhost:5000/api
```

## Authentication
First, you need to get an admin token by logging in:

### 1. Admin Login
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@imvest.com",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "...",
    "email": "admin@imvest.com",
    "role": "admin"
  }
}
```

**Save the token for use in subsequent requests:**
```bash
export ADMIN_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Client APIs

### 1. Client Registration (POST)
Register a new client with KYC documents.

```bash
# JSON Request Version
curl -X POST http://localhost:5000/api/client/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1 (555) 123-4567",
    "dateOfBirth": "1985-06-15",
    "ssn": "123-45-6789",
    "address": "{\"street\":\"123 Main St\",\"city\":\"New York\",\"state\":\"NY\",\"zipCode\":\"10001\",\"country\":\"USA\"}",
    "investmentPlan": "Premium",
    "initialInvestment": "25000",
    "referralCode": "REF123",
    "password": "securePassword123!"
  }'

# Multipart Form-Data Version (with document uploads)
curl -X POST http://localhost:5000/api/client/register \
  -H "Content-Type: multipart/form-data" \
  -F "firstName=John" \
  -F "lastName=Doe" \
  -F "email=john.doe@example.com" \
  -F "phone=+1234567890" \
  -F "dateOfBirth=1990-01-01" \
  -F "ssn=123-45-6789" \
  -F "address={\"street\":\"123 Main St\",\"city\":\"New York\",\"state\":\"NY\",\"zipCode\":\"10001\"}" \
  -F "investmentPlan=8%_compounded" \
  -F "initialInvestment=10000" \
  -F "referralCode=REF123" \
  -F "driverLicense=@/path/to/driver-license.jpg" \
  -F "ssnCard=@/path/to/ssn-card.jpg" \
  -F "proofOfAddress=@/path/to/utility-bill.pdf"
```

**Response:**
```json
{
  "message": "Client registered successfully. Pending approval.",
  "clientId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "status": "pending"
}
```

### 2. Client Login (POST)
Login for approved clients.

```bash
curl -X POST http://localhost:5000/api/client/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "client": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "email": "john.doe@example.com",
    "fullName": "John Doe"
  }
}
```

**Save the client token:**
```bash
export CLIENT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Get Client Overview (GET)
Get client dashboard overview.

```bash
curl -X GET http://localhost:5000/api/client/me/overview \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "overview": {
    "totalInvested": 10000,
    "interestEarnedToDate": 800,
    "currentBalance": 10800,
    "planType": "8%_compounded",
    "startDate": "2024-01-15T10:30:00.000Z",
    "maturityDate": "2025-01-15T10:30:00.000Z",
    "status": "approved"
  },
  "performance": {
    "2024-01": {
      "deposits": 10000,
      "withdrawals": 0,
      "interest": 800
    }
  }
}
```

### 4. Get Client Profile (GET)
Get client profile information.

```bash
curl -X GET http://localhost:5000/api/client/me/profile \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json"
```

### 5. Update Client Profile (PUT)
Update client profile information.

```bash
curl -X PUT http://localhost:5000/api/client/me/profile \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    },
    "bankAccount": {
      "accountNumber": "1234567890",
      "routingNumber": "021000021",
      "bankName": "Chase Bank"
    }
  }'
```

### 6. Upload Documents (POST)
Upload additional documents.

```bash
curl -X POST http://localhost:5000/api/client/me/documents \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "driverLicense=@/path/to/new-driver-license.jpg" \
  -F "ssnCard=@/path/to/new-ssn-card.jpg" \
  -F "proofOfAddress=@/path/to/new-utility-bill.pdf" \
  -F "additionalDocs=@/path/to/additional-doc1.pdf" \
  -F "additionalDocs=@/path/to/additional-doc2.pdf"
```

### 7. Get Referral Information (GET)
Get client's referral program information.

```bash
curl -X GET http://localhost:5000/api/client/me/referrals \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "referralCode": "REF123456",
  "referredClients": [
    {
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "status": "approved",
      "createdAt": "2024-01-20T10:30:00.000Z"
    }
  ],
  "totalReferrals": 1,
  "activeReferrals": 1
}
```

### 8. Get Performance Reports (GET)
Get client performance reports.

```bash
# Get 6 months performance (default)
curl -X GET http://localhost:5000/api/client/me/performance \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json"

# Get 1 month performance
curl -X GET "http://localhost:5000/api/client/me/performance?period=1month" \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json"

# Get 1 year performance
curl -X GET "http://localhost:5000/api/client/me/performance?period=1year" \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json"
```

### 9. Contact Support (POST)
Submit a support request.

```bash
curl -X POST http://localhost:5000/api/client/me/support \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Account Question",
    "message": "I have a question about my investment plan.",
    "priority": "normal"
  }'
```

### 10. Change Password (PUT)
Change client password.

```bash
curl -X PUT http://localhost:5000/api/client/me/change-password \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "oldpassword123",
    "newPassword": "newpassword123"
  }'
```

---

## Communication APIs

### 11. Get Messages (GET)
Get messages for client.

```bash
curl -X GET http://localhost:5000/api/communication/messages \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json"

# Get only unread messages
curl -X GET "http://localhost:5000/api/communication/messages?unreadOnly=true" \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json"
```

### 12. Send Message (POST)
Send message to admin.

```bash
curl -X POST http://localhost:5000/api/communication/messages \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientId": "admin_id_here",
    "subject": "Question about my account",
    "content": "I have a question about my investment plan.",
    "type": "support",
    "priority": "normal"
  }'
```

### 13. Get Conversation Thread (GET)
Get conversation thread.

```bash
curl -X GET http://localhost:5000/api/communication/messages/conversation/thread_id_here \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json"
```

### 14. Mark Message as Read (PUT)
Mark message as read.

```bash
curl -X PUT http://localhost:5000/api/communication/messages/message_id_here/read \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json"
```

### 15. Get Unread Count (GET)
Get unread message count.

```bash
curl -X GET http://localhost:5000/api/communication/messages/unread-count \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json"
```

---

## Admin APIs

### 16. Get Pending Approvals (GET)
Get all clients waiting for approval.

```bash
curl -X GET http://localhost:5000/api/client/pending-approvals \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### 17. Approve/Decline Client (POST)
Approve, decline, or request more information from a client.

```bash
# Approve a client
curl -X POST http://localhost:5000/api/client/64f8a1b2c3d4e5f6a7b8c9d0/approve \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "approve",
    "notes": "All documents verified successfully. Client approved."
  }'

# Decline a client
curl -X POST http://localhost:5000/api/client/64f8a1b2c3d4e5f6a7b8c9d0/approve \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "decline",
    "notes": "SSN verification failed. Application declined."
  }'

# Request more information
curl -X POST http://localhost:5000/api/client/64f8a1b2c3d4e5f6a7b8c9d0/approve \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "request_info",
    "notes": "Please provide additional proof of address. Current document is unclear."
  }'
```

### 18. Get All Clients (GET)
Get all clients with filtering and pagination.

```bash
# Get all clients
curl -X GET http://localhost:5000/api/admin/clients \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"

# Get clients with filters
curl -X GET "http://localhost:5000/api/admin/clients?status=approved&search=john&page=1&limit=10" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### 19. Get Client Details (GET)
Get detailed client information.

```bash
curl -X GET http://localhost:5000/api/admin/clients/64f8a1b2c3d4e5f6a7b8c9d0 \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### 20. Update Client Status (PUT)
Update client status.

```bash
curl -X PUT http://localhost:5000/api/admin/clients/64f8a1b2c3d4e5f6a7b8c9d0/status \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "suspended",
    "notes": "Account suspended due to suspicious activity."
  }'
```

### 21. Get Client Documents (GET)
Get client documents.

```bash
curl -X GET http://localhost:5000/api/admin/clients/64f8a1b2c3d4e5f6a7b8c9d0/documents \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### 22. Get Dashboard Overview (GET)
Get admin dashboard overview.

```bash
# Get 30 days overview (default)
curl -X GET http://localhost:5000/api/admin/dashboard/overview \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"

# Get 7 days overview
curl -X GET "http://localhost:5000/api/admin/dashboard/overview?period=7days" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### 23. Get Financial Reports (GET)
Get financial reports.

```bash
# Get monthly reports (default)
curl -X GET http://localhost:5000/api/admin/dashboard/financial-reports \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"

# Get daily reports
curl -X GET "http://localhost:5000/api/admin/dashboard/financial-reports?reportType=daily&startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### 24. Get Referral Analytics (GET)
Get referral program analytics.

```bash
curl -X GET http://localhost:5000/api/admin/dashboard/referral-analytics \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### 25. Get System Health (GET)
Get system monitoring information.

```bash
curl -X GET http://localhost:5000/api/admin/dashboard/system-health \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

---

## Admin Communication APIs

### 26. Get All Messages (GET)
Get all messages (admin only).

```bash
curl -X GET http://localhost:5000/api/communication/admin/messages \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"

# Get messages with filters
curl -X GET "http://localhost:5000/api/communication/admin/messages?type=support&status=unread" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### 27. Send Message to Client (POST)
Send message to specific client.

```bash
curl -X POST http://localhost:5000/api/communication/admin/messages \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientId": "client_id_here",
    "subject": "Account Update",
    "content": "Your account has been updated successfully.",
    "type": "notification",
    "priority": "normal"
  }'
```

### 28. Send Mass Message (POST)
Send message to multiple clients.

```bash
curl -X POST http://localhost:5000/api/communication/admin/messages/mass \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientIds": ["client_id_1", "client_id_2", "client_id_3"],
    "subject": "System Maintenance Notice",
    "content": "We will be performing system maintenance on Sunday.",
    "type": "announcement",
    "priority": "normal"
  }'
```

### 29. Delete Message (DELETE)
Delete a message (admin only).

```bash
curl -X DELETE http://localhost:5000/api/communication/admin/messages/message_id_here \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

---

## Transaction APIs

### 30. Create Transaction (POST)
Create a new deposit or withdrawal transaction.

```bash
# Create a deposit transaction
curl -X POST http://localhost:5000/api/client/64f8a1b2c3d4e5f6a7b8c9d0/transactions \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "deposit",
    "amount": 5000,
    "paymentMethod": "bank_transfer",
    "description": "Additional investment deposit",
    "notes": "Client requested additional investment"
  }'

# Create a withdrawal transaction
curl -X POST http://localhost:5000/api/client/64f8a1b2c3d4e5f6a7b8c9d0/transactions \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "withdrawal",
    "amount": 2000,
    "paymentMethod": "ach",
    "description": "Partial withdrawal request",
    "bankDetails": {
      "accountNumber": "1234567890",
      "routingNumber": "021000021",
      "bankName": "Chase Bank"
    },
    "notes": "Client requested partial withdrawal"
  }'
```

### 31. Get Transaction History (GET)
Get client's transaction history with pagination and filtering.

```bash
# Get all transactions (default: first 10)
curl -X GET http://localhost:5000/api/client/64f8a1b2c3d4e5f6a7b8c9d0/transactions \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"

# Get transactions with pagination
curl -X GET "http://localhost:5000/api/client/64f8a1b2c3d4e5f6a7b8c9d0/transactions?page=1&limit=5" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"

# Get only deposit transactions
curl -X GET "http://localhost:5000/api/client/64f8a1b2c3d4e5f6a7b8c9d0/transactions?type=deposit" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### 32. Get Client Balance (GET)
Get client's current balance and investment details.

```bash
curl -X GET http://localhost:5000/api/client/64f8a1b2c3d4e5f6a7b8c9d0/balance \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

---

## Complete Test Script

Here's a complete bash script to test all APIs:

```bash
#!/bin/bash

# Set base URL
BASE_URL="http://localhost:5000/api"

echo "🚀 Testing IMVEST APIs"
echo "======================"

# Step 1: Admin Login
echo "1. Admin Login..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@imvest.com",
    "password": "admin123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "✅ Login successful. Token: ${TOKEN:0:20}..."

# Step 2: Client Registration
echo "2. Client Registration..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/client/register \
  -H "Content-Type: multipart/form-data" \
  -F "firstName=John" \
  -F "lastName=Doe" \
  -F "email=john.doe@example.com" \
  -F "phone=+1234567890" \
  -F "dateOfBirth=1990-01-01" \
  -F "ssn=123-45-6789" \
  -F "address={\"street\":\"123 Main St\",\"city\":\"New York\",\"state\":\"NY\",\"zipCode\":\"10001\"}" \
  -F "investmentPlan=8%_compounded" \
  -F "initialInvestment=10000")

CLIENT_ID=$(echo $REGISTER_RESPONSE | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)
echo "✅ Registration successful. Client ID: $CLIENT_ID"

# Step 3: Get Pending Approvals
echo "3. Get Pending Approvals..."
curl -s -X GET $BASE_URL/client/pending-approvals \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.count'
echo "✅ Pending approvals retrieved"

# Step 4: Approve Client
echo "4. Approve Client..."
curl -s -X POST $BASE_URL/client/$CLIENT_ID/approve \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "approve",
    "notes": "All documents verified successfully"
  }'
echo "✅ Client approved"

# Step 5: Get Dashboard Overview
echo "5. Get Dashboard Overview..."
curl -s -X GET $BASE_URL/admin/dashboard/overview \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.overview.totalClients'
echo "✅ Dashboard overview retrieved"

# Step 6: Get All Clients
echo "6. Get All Clients..."
curl -s -X GET $BASE_URL/admin/clients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.pagination.total'
echo "✅ All clients retrieved"

# Step 7: Get System Health
echo "7. Get System Health..."
curl -s -X GET $BASE_URL/admin/dashboard/system-health \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.systemStats.totalClients'
echo "✅ System health retrieved"

echo "🎉 All API tests completed!"
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "message": "Access denied. Invalid or missing token."
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Insufficient permissions."
}
```

### 404 Not Found
```json
{
  "message": "Client not found"
}
```

### 409 Conflict
```json
{
  "message": "Client with this email or SSN already exists"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error"
}
```

---

## Notes

1. **File Uploads**: For document uploads, replace `/path/to/file` with actual file paths
2. **Authentication**: Always include the Bearer token in the Authorization header for protected endpoints
3. **Client ID**: Replace `64f8a1b2c3d4e5f6a7b8c9d0` with actual client IDs from responses
4. **Pagination**: Use `page` and `limit` query parameters for paginated results
5. **Filtering**: Use query parameters to filter results by various criteria
6. **Permissions**: Different admin roles have different permissions for various endpoints
7. **Real-time Updates**: Some endpoints support real-time updates via WebSocket (if implemented)
8. **Rate Limiting**: API calls are rate-limited to prevent abuse
9. **Audit Logging**: All admin actions are automatically logged for compliance

---

## Admin Client Management APIs

### 1. Get All Clients (GET)
Get a list of all clients with filtering and pagination.

```bash
# Get all clients
curl -X GET http://localhost:5000/api/admin/clients \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Get with pagination and filtering
curl -X GET "http://localhost:5000/api/admin/clients?page=1&limit=10&status=pending" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Response:**
```json
{
  "clients": [
    {
      "_id": "65f3a1b2c3d4e5f6a7b8c9d0",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1 (555) 123-4567",
      "status": "pending",
      "investmentPlan": "Premium",
      "createdAt": "2023-09-15T10:30:00.000Z",
      "lastActivity": "2023-09-15T10:30:00.000Z"
    },
    // More clients...
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

### 2. Get Client Details (GET)
Get detailed information about a specific client.

```bash
curl -X GET http://localhost:5000/api/admin/clients/65f3a1b2c3d4e5f6a7b8c9d0 \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Response:**
```json
{
  "client": {
    "_id": "65f3a1b2c3d4e5f6a7b8c9d0",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1 (555) 123-4567",
    "dateOfBirth": "1985-06-15",
    "ssn": "***-**-6789",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "investmentPlan": "Premium",
    "initialInvestment": 25000,
    "currentValue": 26500,
    "status": "pending",
    "createdAt": "2023-09-15T10:30:00.000Z",
    "lastActivity": "2023-09-15T10:30:00.000Z",
    "riskProfile": "Aggressive",
    "referralCode": "REF123"
  },
  "documents": [
    {
      "_id": "65f3a1b2c3d4e5f6a7b8c9d1",
      "type": "ID",
      "filename": "drivers_license.jpg",
      "uploadDate": "2023-09-15T10:30:00.000Z",
      "status": "verified"
    },
    {
      "_id": "65f3a1b2c3d4e5f6a7b8c9d2",
      "type": "ProofOfAddress",
      "filename": "utility_bill.pdf",
      "uploadDate": "2023-09-15T10:30:00.000Z",
      "status": "verified"
    }
  ],
  "transactions": [
    {
      "_id": "65f3a1b2c3d4e5f6a7b8c9d3",
      "type": "deposit",
      "amount": 25000,
      "status": "completed",
      "date": "2023-09-15T10:35:00.000Z"
    }
  ]
}
```

### 3. Update Client Status (PUT)
Update a client's status (approve or reject).

```bash
curl -X PUT http://localhost:5000/api/admin/clients/65f3a1b2c3d4e5f6a7b8c9d0/status \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved"
  }'
```

**Response:**
```json
{
  "message": "Client status updated successfully",
  "client": {
    "_id": "65f3a1b2c3d4e5f6a7b8c9d0",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "status": "approved",
    "updatedAt": "2023-09-16T14:20:00.000Z"
  }
}
```

### 4. Get Client Documents (GET)
Get all documents uploaded by a client.

```bash
curl -X GET http://localhost:5000/api/admin/clients/65f3a1b2c3d4e5f6a7b8c9d0/documents \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Response:**
```json
{
  "documents": [
    {
      "_id": "65f3a1b2c3d4e5f6a7b8c9d1",
      "clientId": "65f3a1b2c3d4e5f6a7b8c9d0",
      "type": "ID",
      "filename": "drivers_license.jpg",
      "path": "/uploads/documents/65f3a1b2c3d4e5f6a7b8c9d0/drivers_license.jpg",
      "mimeType": "image/jpeg",
      "size": 2458745,
      "uploadDate": "2023-09-15T10:30:00.000Z",
      "status": "verified",
      "verifiedBy": "65f3a1b2c3d4e5f6a7b8c9e1",
      "verifiedAt": "2023-09-15T14:20:00.000Z"
    },
    {
      "_id": "65f3a1b2c3d4e5f6a7b8c9d2",
      "clientId": "65f3a1b2c3d4e5f6a7b8c9d0",
      "type": "ProofOfAddress",
      "filename": "utility_bill.pdf",
      "path": "/uploads/documents/65f3a1b2c3d4e5f6a7b8c9d0/utility_bill.pdf",
      "mimeType": "application/pdf",
      "size": 1245678,
      "uploadDate": "2023-09-15T10:30:00.000Z",
      "status": "verified",
      "verifiedBy": "65f3a1b2c3d4e5f6a7b8c9e1",
      "verifiedAt": "2023-09-15T14:20:00.000Z"
    }
  ]
}
```

### 5. Delete Client Account (DELETE)
Delete a client account (admin only).

```bash
curl -X DELETE http://localhost:5000/api/admin/clients/65f3a1b2c3d4e5f6a7b8c9d0 \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Response:**
```json
{
  "message": "Client account deleted successfully",
  "deletedClient": {
    "_id": "65f3a1b2c3d4e5f6a7b8c9d0",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  }
}
```

### Windows PowerShell Examples

For Windows PowerShell, you may need to modify the commands as follows:

```powershell
# Get all clients
Invoke-RestMethod -Method GET -Uri "http://localhost:5000/api/admin/clients" `
  -Headers @{"Authorization"="Bearer $env:ADMIN_TOKEN"}

# Get client details
Invoke-RestMethod -Method GET -Uri "http://localhost:5000/api/admin/clients/65f3a1b2c3d4e5f6a7b8c9d0" `
  -Headers @{"Authorization"="Bearer $env:ADMIN_TOKEN"}

# Update client status
Invoke-RestMethod -Method PUT -Uri "http://localhost:5000/api/admin/clients/65f3a1b2c3d4e5f6a7b8c9d0/status" `
  -Headers @{"Authorization"="Bearer $env:ADMIN_TOKEN"; "Content-Type"="application/json"} `
  -Body '{"status": "approved"}'
```
10. **Data Validation**: All input data is validated before processing 