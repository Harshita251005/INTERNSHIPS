const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const migrateProducts = async () => {
  try {
    console.log("🔄 Starting product migration...");

    const categories = await Category.find();
    console.log(`Found ${categories.length} categories`);

    const products = await Product.find();
    console.log(`Found ${products.length} products to migrate`);

    const categoryMapping = {
      "Earrings": ["Earring", "Diamond Stud"],
      "Finger Rings": ["Ring", "Solitaire"],
      "Bangles": ["Bangle", "Kada"],
      "Chain Pendant": ["Pendant", "Chain"],
      "Necklaces": ["Necklace", "Pendant", "Mangalsutra"],
      "Bracelets": ["Bracelet", "Anklet"],
    };

    let updatedCount = 0;

    for (const product of products) {
      if (product.category && mongoose.Types.ObjectId.isValid(product.category)) {
        console.log(`✓ ${product.name} already has valid category ID`);
        continue;
      }

      let matchingCategory = null;

      for (const [categoryName, keywords] of Object.entries(categoryMapping)) {
        const category = categories.find(cat => cat.name === categoryName);
        if (!category) continue;

        const matches = keywords.some(keyword =>
          product.name.toLowerCase().includes(keyword.toLowerCase())
        );

        if (matches) {
          matchingCategory = category;
          break;
        }
      }

      if (matchingCategory) {
        product.category = matchingCategory._id;
        await product.save();
        console.log(`✓ Updated ${product.name} → ${matchingCategory.name}`);
        updatedCount++;
      } else {
        console.log(`✗ No category found for ${product.name} (attempting Necklaces as default)`);
        const defaultCategory = categories.find(cat => cat.name === "Necklaces");
        if (defaultCategory) {
          product.category = defaultCategory._id;
          await product.save();
          console.log(`✓ Assigned ${product.name} to default category: Necklaces`);
          updatedCount++;
        }
      }
    }

    console.log(`\n✅ Migration completed! Updated ${updatedCount} products`);
    process.exit();
  } catch (error) {
    console.error("❌ Error during migration:", error);
    process.exit(1);
  }
};

migrateProducts();


