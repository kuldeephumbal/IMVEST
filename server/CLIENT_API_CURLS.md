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

### 2. Get Pending Approvals (GET)
Get all clients waiting for approval.

```bash
curl -X GET http://localhost:5000/api/client/pending-approvals \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "pendingClients": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "initialInvestment": 10000,
      "investmentPlan": "8%_compounded",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "documents": {
        "driverLicense": "uploads/documents/driverLicense-1234567890.jpg",
        "ssnCard": "uploads/documents/ssnCard-1234567890.jpg",
        "proofOfAddress": "uploads/documents/proofOfAddress-1234567890.pdf"
      }
    }
  ],
  "count": 1
}
```

### 3. Approve/Decline Client (POST)
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

**Response:**
```json
{
  "message": "Client approved successfully",
  "status": "approved"
}
```

### 4. Get Client Balance (GET)
Get client's current balance and investment details.

```bash
curl -X GET http://localhost:5000/api/client/64f8a1b2c3d4e5f6a7b8c9d0/balance \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "client": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "status": "approved",
    "investmentPlan": "8%_compounded",
    "startDate": "2024-01-15T10:30:00.000Z",
    "maturityDate": "2025-01-15T10:30:00.000Z"
  },
  "balance": {
    "totalDeposits": 10000,
    "totalWithdrawals": 0,
    "totalInterest": 0,
    "totalFees": 0,
    "currentBalance": 10000
  },
  "investmentDetails": {
    "initialInvestment": 10000,
    "totalInvested": 10000,
    "totalEarned": 0,
    "currentBalance": 10000
  }
}
```

### 5. Create Transaction (POST)
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

**Response:**
```json
{
  "message": "Transaction created successfully",
  "transaction": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "type": "deposit",
    "amount": 5000,
    "status": "pending",
    "description": "Additional investment deposit",
    "referenceNumber": "TXN-1705312200000-ABC123",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 6. Get Transaction History (GET)
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

# Get only withdrawal transactions
curl -X GET "http://localhost:5000/api/client/64f8a1b2c3d4e5f6a7b8c9d0/transactions?type=withdrawal" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "transactions": [
    {
      "id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "type": "deposit",
      "amount": 5000,
      "status": "pending",
      "description": "Additional investment deposit",
      "referenceNumber": "TXN-1705312200000-ABC123",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "type": "deposit",
      "amount": 10000,
      "status": "completed",
      "description": "Initial investment - 8%_compounded",
      "referenceNumber": "TXN-1705312000000-DEF456",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "pages": 1
  }
}
```

---

## Complete Test Script

Here's a complete bash script to test all APIs:

```bash
#!/bin/bash

# Set base URL
BASE_URL="http://localhost:5000/api"

echo "🚀 Testing IMVEST Client APIs"
echo "=============================="

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

# Step 5: Get Client Balance
echo "5. Get Client Balance..."
curl -s -X GET $BASE_URL/client/$CLIENT_ID/balance \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.balance.currentBalance'
echo "✅ Balance retrieved"

# Step 6: Create Transaction
echo "6. Create Transaction..."
curl -s -X POST $BASE_URL/client/$CLIENT_ID/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "deposit",
    "amount": 5000,
    "paymentMethod": "bank_transfer",
    "description": "Additional investment deposit"
  }'
echo "✅ Transaction created"

# Step 7: Get Transaction History
echo "7. Get Transaction History..."
curl -s -X GET $BASE_URL/client/$CLIENT_ID/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.pagination.total'
echo "✅ Transaction history retrieved"

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
5. **Filtering**: Use `type` query parameter to filter transactions by type (deposit, withdrawal, etc.) 