const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true }, // e.g., 'Popular', 'Special', 'Featured'
    collectionName: { type: String, required: true }, // e.g., 'Tables', 'Beds', 'Chairs'
    saleOff: { type: Number, default: 0 } // Percentage off
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
module.exports = Product;
