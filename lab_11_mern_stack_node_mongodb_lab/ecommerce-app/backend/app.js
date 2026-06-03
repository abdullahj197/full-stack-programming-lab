const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mydb')
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number
});

// Model
const Product = mongoose.model('Product', productSchema);

// Routes

app.get('/', (req, res) => {
  res.send("Backend Running");
});

app.get('/add', async (req, res) => {
  const product = new Product({ name: "Phone", price: 500 });
  await product.save();
  res.send("Product Added");
});

app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});