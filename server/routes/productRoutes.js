const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct,getProductById
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route for /api/products
router.route('/')
    .get(getProducts)
    .post(protect, admin, createProduct);

// Route for /api/products/:id
router.route('/:id')
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);
    router.route('/:id').get(getProductById);

module.exports = router;