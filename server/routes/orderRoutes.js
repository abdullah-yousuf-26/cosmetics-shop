const express = require('express');
const router = express.Router();
const { 
    addOrderItems, 
    getMyOrders, 
    getOrders, 
    updateOrderToDelivered,
    getOrderById, // Check spelling
    deleteOrder   // Check spelling
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Handles POST /api/orders (User) and GET /api/orders (Admin)
router.route('/')
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders);

// User-specific orders
router.route('/mine').get(protect, getMyOrders);

// Delivery update
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

// Single order operations (Get details or Delete)
router.route('/:id')
    .get(protect, getOrderById)
    .delete(protect, admin, deleteOrder); // Now this will work!

module.exports = router;