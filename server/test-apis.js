const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testClient = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  dateOfBirth: '1990-01-01',
  ssn: '123-45-6789',
  address: JSON.stringify({
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001'
  }),
  investmentPlan: '8%_compounded',
  initialInvestment: 10000
};

const testAdmin = {
  email: 'admin@imvest.com',
  password: 'admin123'
};

let adminToken = '';

async function testAPIs() {
  console.log('🚀 Testing IMVEST Backend APIs\n');

  try {
    // Step 1: Admin Login
    console.log('1. Testing Admin Login...');
    const loginResponse = await axios.post(`${BASE_URL}/admin/login`, testAdmin);
    adminToken = loginResponse.data.token;
    console.log('✅ Admin login successful\n');

    // Step 2: Client Registration
    console.log('2. Testing Client Registration...');
    const formData = new FormData();
    
    // Add text fields
    Object.keys(testClient).forEach(key => {
      formData.append(key, testClient[key]);
    });

    const registerResponse = await axios.post(`${BASE_URL}/client/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    const clientId = registerResponse.data.clientId;
    console.log('✅ Client registration successful');
    console.log(`   Client ID: ${clientId}\n`);

    // Step 3: Get Pending Approvals
    console.log('3. Testing Get Pending Approvals...');
    const pendingResponse = await axios.get(`${BASE_URL}/client/pending-approvals`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    console.log('✅ Pending approvals retrieved');
    console.log(`   Pending clients: ${pendingResponse.data.count}\n`);

    // Step 4: Approve Client
    console.log('4. Testing Client Approval...');
    const approveResponse = await axios.post(`${BASE_URL}/client/${clientId}/approve`, {
      action: 'approve',
      notes: 'All documents verified successfully'
    }, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    console.log('✅ Client approved successfully\n');

    // Step 5: Get Client Balance
    console.log('5. Testing Get Client Balance...');
    const balanceResponse = await axios.get(`${BASE_URL}/client/${clientId}/balance`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    console.log('✅ Client balance retrieved');
    console.log(`   Current Balance: $${balanceResponse.data.balance.currentBalance}\n`);

    // Step 6: Create Transaction (Deposit)
    console.log('6. Testing Create Transaction...');
    const transactionResponse = await axios.post(`${BASE_URL}/client/${clientId}/transactions`, {
      type: 'deposit',
      amount: 5000,
      paymentMethod: 'bank_transfer',
      description: 'Additional investment deposit'
    }, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    console.log('✅ Transaction created successfully');
    console.log(`   Transaction ID: ${transactionResponse.data.transaction.id}\n`);

    // Step 7: Get Transaction History
    console.log('7. Testing Get Transaction History...');
    const historyResponse = await axios.get(`${BASE_URL}/client/${clientId}/transactions`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    console.log('✅ Transaction history retrieved');
    console.log(`   Total transactions: ${historyResponse.data.pagination.total}\n`);

    console.log('🎉 All API tests completed successfully!');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPIs();
}

module.exports = { testAPIs }; 