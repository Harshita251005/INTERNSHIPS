import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const testAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const admin = await User.findOne({ email: 'admin@test.com' });
    
    if (admin) {
      console.log('✅ Admin user found!');
      console.log('Name:', admin.name);
      console.log('Email:', admin.email);
      console.log('Role:', admin.role);
      console.log('\n✅ You can login with:');
      console.log('Email: admin@test.com');
      console.log('Password: Admin@123');
    } else {
      console.log('❌ Admin user NOT found!');
      console.log('Please run: npm run seed');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testAdmin();
