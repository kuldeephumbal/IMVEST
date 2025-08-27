require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

async function createSuperAdmin() {
  try {
    console.log('🔧 Creating/Upgrading Super Admin User');
    console.log('=====================================\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if super admin already exists
    const existingSuperAdmin = await Admin.findOne({ role: 'super_admin' });
    if (existingSuperAdmin) {
      console.log('⚠️  Super admin already exists!');
      console.log(`📧 Email: ${existingSuperAdmin.email}`);
      console.log(`👤 Name: ${existingSuperAdmin.firstName} ${existingSuperAdmin.lastName}`);
      console.log(`🔑 Role: ${existingSuperAdmin.role}`);
      console.log(`🔐 Permissions: ${existingSuperAdmin.permissions.join(', ')}`);
      process.exit(0);
    }

    // Check if the target email already exists
    const targetEmail = 'legendsahil768@gmail.com';
    const existingAdmin = await Admin.findOne({ email: targetEmail });
    
    if (existingAdmin) {
      // Upgrade existing admin to super admin
      console.log(`🔄 Upgrading existing admin ${targetEmail} to super admin...`);
      
      existingAdmin.role = 'super_admin';
      existingAdmin.permissions = [
        'approve_clients',
        'manage_investments',
        'view_reports',
        'manage_contracts',
        'system_settings',
        'user_management'
      ];
      existingAdmin.isActive = true;
      
      await existingAdmin.save();
      
      console.log('✅ Admin upgraded to super admin successfully!');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👤 Name: ${existingAdmin.firstName} ${existingAdmin.lastName}`);
      console.log(`🔑 Role: ${existingAdmin.role}`);
      console.log(`🔐 Permissions: ${existingAdmin.permissions.join(', ')}`);
      
    } else {
      // Create new super admin
      console.log('🆕 Creating new super admin...');
      
      const superAdmin = new Admin({
        email: targetEmail,
        password: 'StrongPass!234',
        firstName: 'sahil',
        lastName: 'nakiya',
        role: 'super_admin',
        permissions: [
          'approve_clients',
          'manage_investments',
          'view_reports',
          'manage_contracts',
          'system_settings',
          'user_management'
        ],
        isActive: true
      });

      await superAdmin.save();
      
      console.log('✅ Super Admin created successfully!');
      console.log(`📧 Email: ${superAdmin.email}`);
      console.log(`👤 Name: ${superAdmin.firstName} ${superAdmin.lastName}`);
      console.log(`🔑 Role: ${superAdmin.role}`);
      console.log(`🔐 Permissions: ${superAdmin.permissions.join(', ')}`);
    }

    console.log('\n🎉 You can now login with these credentials!');
    console.log('📝 Email: legendsahil768@gmail.com');
    console.log('🔐 Password: StrongPass!234');

  } catch (error) {
    console.error('❌ Error creating/upgrading super admin:', error.message);
    if (error.code === 11000) {
      console.log('   Email already exists in database');
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
createSuperAdmin().catch(console.error); 