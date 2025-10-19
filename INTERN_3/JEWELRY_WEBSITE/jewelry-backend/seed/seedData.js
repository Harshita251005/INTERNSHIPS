import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    const categories = await Category.insertMany([
      { name: "Earrings", imageUrl: "/images/earrings.jpg" },
      { name: "Finger Rings", imageUrl: "/images/rings.jpg" },
      { name: "Bangles", imageUrl: "/images/bangles.jpg" },
      { name: "Chain Pendant", imageUrl: "/images/chain.jpg" },
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
      },
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
