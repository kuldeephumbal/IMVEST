const fs = require('fs');
const path = require('path');

console.log('🚀 IMVEST Server Setup Script');
console.log('=============================\n');

// Check if .env exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('📝 Creating .env file with default values...');
  
  const envContent = `# Database Configuration
MONGO_URI=mongodb://localhost:27017/IMVEST

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Server Configuration
PORT=5000
NODE_ENV=development
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created!');
  console.log('⚠️  Please update the email credentials in .env file');
} else {
  console.log('✅ .env file exists');
}

// Check required environment variables
const envContent = fs.readFileSync(envPath, 'utf8');
const requiredVars = ['MONGO_URI', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASSWORD'];

console.log('\n📋 Environment Variables Check:');
requiredVars.forEach(varName => {
  if (envContent.includes(varName)) {
    console.log(`✅ ${varName} - Found`);
  } else {
    console.log(`❌ ${varName} - Missing`);
  }
});

// Check uploads directory
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  console.log('\n📁 Creating uploads directory...');
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ uploads directory created');
} else {
  console.log('\n✅ uploads directory exists');
}

// Check documents subdirectory
const documentsDir = path.join(uploadsDir, 'documents');
if (!fs.existsSync(documentsDir)) {
  console.log('📁 Creating documents directory...');
  fs.mkdirSync(documentsDir, { recursive: true });
  console.log('✅ documents directory created');
} else {
  console.log('✅ documents directory exists');
}

console.log('\n🎉 Setup complete!');
console.log('\n📝 Next steps:');
console.log('1. Update EMAIL_USER and EMAIL_PASSWORD in .env file');
console.log('2. Make sure MongoDB is running');
console.log('3. Run: npm install');
console.log('4. Run: npm start'); 