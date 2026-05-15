const Product = require('../models/Product');



// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const { 
            name, description, price, discountPrice, brand, 
            category, subCategory, images, countInStock, isFeatured 
        } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.brand = brand || product.brand;
            product.category = category || product.category;
            product.subCategory = subCategory || product.subCategory;
            product.images = images || product.images;
            product.countInStock = countInStock || product.countInStock;
            product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const { 
            name, description, price, discountPrice, brand, 
            category, subCategory, concern, skinType, 
            images, countInStock, isFeatured, variants 
        } = req.body;

        const product = new Product({
            name,
            description,
            price,
            discountPrice,
            brand,
            category,
            subCategory,
            concern, // Array
            skinType, // Array
            images,   // Array
            countInStock,
            isFeatured,
            variants
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// @desc    Fetch single product
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            // This is why you get a 404 if the ID is wrong
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: "Invalid Product ID" });
    }
};



// @desc    Fetch all products (with optional category filter)
// @route   GET /api/products
const getProducts = async (req, res) => {
    try {
        const { category } = req.query; // Look for ?category=Fragrance
        let query = {};

        if (category) {
            // Case-insensitive search to match your enum strictly
            query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Keep your existing getProducts and createProduct functions...
// Ensure you export the new ones at the bottom:
module.exports = { 
    getProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct ,
    getProductById
};
