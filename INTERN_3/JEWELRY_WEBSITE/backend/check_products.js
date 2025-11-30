import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import Product from './models/Product.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    let output = 'Connected to MongoDB\n';
    
    const products = await Product.find({});
    output += `\nFound ${products.length} products:\n\n`;
    
    for (const product of products) {
      const categoryType = typeof product.category;
      const isObjectId = product.category instanceof mongoose.Types.ObjectId;
      output += `${product.title}:\n`;
      output += `  ID: ${product._id}\n`;
      output += `  Category: ${product.category}\n`;
      output += `  Category Type: ${categoryType}\n`;
      output += `  Is ObjectId: ${isObjectId}\n\n`;
    }
    
    fs.writeFileSync('product_check_results.txt', output);
    console.log('Results written to product_check_results.txt');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
