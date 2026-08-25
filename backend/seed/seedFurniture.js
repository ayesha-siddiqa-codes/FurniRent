const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Furniture = require("../models/Furniture");

dotenv.config();

const furnitureData = [
  {
    name: "Modern Sofa",
    description:
      "A comfortable and stylish modern sofa perfect for living rooms.",
    category: "Living Room",
    pricePerDay: 500,
    image: "",
    available: true,
  },

  {
    name: "Elegant Dining Table",
    description:
      "A spacious and elegant dining table suitable for family meals.",
    category: "Dining Room",
    pricePerDay: 400,
    image: "",
    available: true,
  },

  {
    name: "Office Chair",
    description:
      "A comfortable ergonomic office chair suitable for work and study.",
    category: "Office",
    pricePerDay: 250,
    image: "",
    available: true,
  },

  {
    name: "King Bed",
    description:
      "A premium king-size bed offering comfort and a luxurious look.",
    category: "Bedroom",
    pricePerDay: 700,
    image: "",
    available: true,
  },

  {
    name: "Study Table",
    description:
      "A compact and practical study table perfect for students and home offices.",
    category: "Study Room",
    pricePerDay: 300,
    image: "",
    available: true,
  },
];

const seedFurniture = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    await Furniture.deleteMany();

    console.log("Existing furniture removed");

    await Furniture.insertMany(furnitureData);

    console.log("Furniture data inserted successfully");

    console.log(`Total furniture added: ${furnitureData.length}`);

    await mongoose.connection.close();

    console.log("MongoDB connection closed");

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedFurniture();