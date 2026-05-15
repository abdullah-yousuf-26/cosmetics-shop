const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number }, // To show "Sale" price
    brand: { type: String, required: true },
    
    // Key for Easy Navigation
    category: { type: String, required: true, enum: ['Makeup', 'Skincare', 'Haircare', 'Fragrance'] },
    subCategory: { type: String }, // e.g., 'Lipstick', 'Serum'
    
    // The "BD Market" Grabber
    concern: [{ type: String }], // e.g., ['Acne', 'Glow', 'Anti-Aging']
    skinType: [{ type: String, enum: ['Oily', 'Dry', 'Combination', 'Sensitive', 'All'] }],

    // Visuals & Inventory
    images: [{ type: String, required: true }], // URLs to images
    countInStock: { type: Number, required: true, default: 0 },
    isFeatured: { type: Boolean, default: false },
    
    // Product Variants (Colors/Shades)
    variants: [
        {
            shadeName: String,
            shadeHex: String, // To show color circles
            stock: Number
        }
    ],
    
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
