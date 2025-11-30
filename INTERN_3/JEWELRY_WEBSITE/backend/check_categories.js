import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import Product from './models/Product.js';
import Category from './models/Category.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    let output = 'Checking category references...\n\n';
    
    const products = await Product.find({});
    const categories = await Category.find({});
    
    output += `Found ${categories.length} categories in database:\n`;
    categories.forEach(cat => {
      output += `  - ${cat.name} (${cat._id})\n`;
    });
    output += '\n';
    
    output += `Checking ${products.length} products:\n\n`;
    
    for (const product of products) {
      const categoryExists = categories.some(cat => cat._id.toString() === product.category.toString());
      output += `${product.title}:\n`;
      output += `  Category ID: ${product.category}\n`;
      output += `  Category Exists: ${categoryExists ? 'YES ✅' : 'NO ❌'}\n\n`;
    }
    
    fs.writeFileSync('category_check_results.txt', output);
    console.log('Results written to category_check_results.txt');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
