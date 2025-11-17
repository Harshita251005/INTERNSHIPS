const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const checkDatabase = async () => {
  try {
    console.log("📊 Checking database...\n");

    // Get all categories
    const categories = await Category.find();
    console.log(`📁 Categories (${categories.length}):`);
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (ID: ${cat._id})`);
    });

    console.log("\n📦 Products:");
    const products = await Product.find();
    console.log(`Total products: ${products.length}\n`);

    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Category ID: ${product.category}`);
      console.log(`   Category Type: ${typeof product.category}`);
      
      // Try to find matching category
      const matchingCat = categories.find(c => c._id.toString() === product.category?.toString());
      if (matchingCat) {
        console.log(`   ✓ Matched to: ${matchingCat.name}`);
      } else {
        console.log(`   ✗ No category match found`);
      }
      console.log("");
    });

    // Test the filter
    console.log("🧪 Testing filter...");
    if (categories.length > 0) {
      const testCategoryId = categories[0]._id;
      console.log(`\nFetching products for category: ${categories[0].name} (${testCategoryId})`);
      const filtered = await Product.find({ category: testCategoryId });
      console.log(`Found ${filtered.length} products`);
      filtered.forEach(p => console.log(`   - ${p.name}`));
    }

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

checkDatabase();

