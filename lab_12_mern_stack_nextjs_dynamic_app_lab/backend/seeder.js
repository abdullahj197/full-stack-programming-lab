const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const products = [
  {
    title: "Title & Photoshop's version Lorem",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: 124.99,
    image: "https://via.placeholder.com/300x200.png?text=Product+Image",
    category: "Popular",
    collectionName: "Tables"
  },
  {
    title: "Title & Photoshop's version Lorem",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: 124.99,
    image: "https://via.placeholder.com/300x200.png?text=Product+Image",
    category: "Special",
    collectionName: "Beds"
  },
  {
    title: "Title & Photoshop's version Lorem",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: 124.99,
    image: "https://via.placeholder.com/300x200.png?text=Product+Image",
    category: "Featured",
    collectionName: "Chairs"
  },
  // Adding more dummy products to fill out the tabs
  {
    title: "Rustic Wooden Table",
    description: "Beautiful reclaimed wood table.",
    price: 149.99,
    image: "https://via.placeholder.com/300x200.png?text=Rustic+Table",
    category: "Popular",
    collectionName: "Tables"
  },
  {
    title: "Modern Oak Bed",
    description: "Sturdy and stylish oak bed frame.",
    price: 299.99,
    image: "https://via.placeholder.com/300x200.png?text=Oak+Bed",
    category: "Special",
    collectionName: "Beds"
  },
  {
    title: "Vintage Lounge Chair",
    description: "Comfortable vintage style lounge chair.",
    price: 199.99,
    image: "https://via.placeholder.com/300x200.png?text=Vintage+Chair",
    category: "Featured",
    collectionName: "Chairs"
  }
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
