const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    const categories = await Category.insertMany([
      { name: "Earrings", imageUrl: "/images/earrings.jpg", description: "Elegant earrings for every occasion" },
      { name: "Finger Rings", imageUrl: "/images/rings.jpg", description: "Stunning rings for every finger" },
      { name: "Bangles", imageUrl: "/images/bangles.jpg", description: "Beautiful bangles for your wrist" },
      { name: "Chain Pendant", imageUrl: "/images/chain.jpg", description: "Exquisite chains and pendants" },
      { name: "Necklaces", imageUrl: "/images/necklaces.jpg", description: "Beautiful necklaces for every occasion" },
    ]);

    const products = await Product.insertMany([
      {
        name: "Gold-Plated Earrings",
        description: "Elegant gold-plated earrings for every occasion.",
        category: categories[0]._id,
        price: 1299,
        discount: 10,
        baseMetal: "Gold",
        polish: "Matte",
        rating: 4.5,
        imageUrl: "/images/earrings1.jpg",
        stock: 15
      },
      {
        name: "Silver Ring",
        description: "Classic sterling silver ring with shine finish.",
        category: categories[1]._id,
        price: 899,
        discount: 5,
        baseMetal: "Silver",
        polish: "Glossy",
        rating: 4.2,
        imageUrl: "/images/ring1.jpg",
        stock: 20
      },
      {
        name: "Gold Bangle",
        description: "Traditional gold bangle with intricate design.",
        category: categories[2]._id,
        price: 2499,
        discount: 15,
        baseMetal: "Gold",
        polish: "Matte",
        rating: 4.8,
        imageUrl: "/images/bangle1.jpg",
        stock: 10
      },
      {
        name: "Silver Chain Pendant",
        description: "Beautiful silver chain with pendant.",
        category: categories[3]._id,
        price: 1599,
        discount: 8,
        baseMetal: "Silver",
        polish: "Glossy",
        rating: 4.4,
        imageUrl: "/images/chain1.jpg",
        stock: 25
      },
      {
        name: "Diamond Necklace",
        description: "Elegant diamond necklace with premium finish.",
        category: categories[4]._id,
        price: 4999,
        discount: 20,
        baseMetal: "Gold",
        polish: "Glossy",
        rating: 4.9,
        imageUrl: "/images/necklace1.jpg",
        stock: 8
      },
      {
        name: "Pearl Necklace",
        description: "Beautiful pearl necklace perfect for special occasions.",
        category: categories[4]._id,
        price: 2799,
        discount: 12,
        baseMetal: "Silver",
        polish: "Matte",
        rating: 4.7,
        imageUrl: "/images/necklace2.jpg",
        stock: 12
      },
      {
        name: "Gold Necklace with Pendant",
        description: "Stunning gold necklace with decorative pendant.",
        category: categories[4]._id,
        price: 3499,
        discount: 15,
        baseMetal: "Gold",
        polish: "Glossy",
        rating: 4.6,
        imageUrl: "/images/necklace3.jpg",
        stock: 18
      }
    ]);

    const adminUser = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: bcrypt.hashSync("admin123", 10),
      isAdmin: true,
    });

    console.log("✅ Database seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();

