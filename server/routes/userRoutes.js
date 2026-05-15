const express = require('express');
const router = express.Router();
// 1. Keep your imports clean
const { 
    registerUser, 
    authUser, 
    getUsers,
    deleteUser, 
    updateUserRole 
} = require('../controllers/userController');

const { protect, admin } = require('../middleware/authMiddleware');

// 2. The Routes

// Handles POST /api/users (Register) AND GET /api/users (Admin View)
router.route('/')
    .post(registerUser)
    .get(protect, admin, getUsers);

// Handles POST /api/users/login
router.post('/login', authUser);

router.route('/:id').delete(protect, admin, deleteUser);
router.route('/:id/role').put(protect, admin, updateUserRole);


module.exports = router;