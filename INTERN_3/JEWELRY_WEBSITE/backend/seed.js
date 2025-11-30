import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin User - YOUR ADMIN ACCOUNT
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'Admin@123',
      role: 'admin',
      shopkeeperApproved: true,
    });
    console.log('✅ Created admin user:', admin.email);

    console.log('✅ Created categories');

  
    await Product.insertMany(products);
    console.log('✅ Created sample products');

    console.log('\n✨ Database seeding completed successfully!\n');
    console.log('📋 Login Credentials:\n');
    console.log('Admin:');
    console.log('  Email: admin@test.com');
    console.log('  Password: Admin@123\n');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
