const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const category = req.query.category;
        const query = category ? { category } : {};
        const products = await Product.find(query);
        if (products.length === 0) {
            // Fallback dummy data if DB is empty or not connected
            const dummy = [
              { _id: '1', title: "Title & Photoshop's version Lorem", price: 124.99, category: "Popular", collectionName: "Tables", image: "https://via.placeholder.com/300x200.png?text=Table+1" },
              { _id: '2', title: "Modern Oak Bed", price: 299.99, category: "Special", collectionName: "Beds", image: "https://via.placeholder.com/300x200.png?text=Bed+1" },
              { _id: '3', title: "Vintage Lounge Chair", price: 199.99, category: "Featured", collectionName: "Chairs", image: "https://via.placeholder.com/300x200.png?text=Chair+1" }
            ];
            return res.json(category ? dummy.filter(d => d.category === category) : dummy);
        }
        res.json(products);
    } catch (error) {
        console.error("DB Error, sending fallback data:", error.message);
        const dummy = [
          { _id: '1', title: "Title & Photoshop's version Lorem", price: 124.99, category: "Featured", collectionName: "Tables", image: "/imagess/2.jfif" },
          { _id: '2', title: "Modern Oak Bed", price: 299.99, category: "Special", collectionName: "Beds", image: "/imagess/3.jfif" },
          { _id: '3', title: "Vintage Lounge Chair", price: 199.99, category: "Popular", collectionName: "Chairs", image: "/imagess/4.jfif" },
          { _id: '4', title: "Classic Timber Cabinet", price: 399.99, category: "Featured", collectionName: "Cabinets", image: "/imagess/5.jfif" },
          { _id: '5', title: "Cozy Armchair", price: 159.99, category: "Special", collectionName: "Chairs", image: "/imagess/6.jfif" },
          { _id: '6', title: "Minimalist Bookshelf", price: 89.99, category: "Popular", collectionName: "Bookcases", image: "/imagess/7.jfif" }
        ];
        const category = req.query.category;
        res.json(category ? dummy.filter(d => d.category === category) : dummy);
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getProducts,
    getProductById
};
