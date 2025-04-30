const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getAllUsers, getUserById, updateUser, deleteUser, checkAuth, updateProfile, getUserProfile } = require('../controllers/UserController');
const { validateUserUpdate } = require('../middleware/hospitalAuth');

// Get all users (admin only)
router.get('/', authMiddleware, getAllUsers);

// Check authentication status
router.get('/check-auth', authMiddleware, checkAuth);

// Get single user
router.get('/:id', authMiddleware, getUserById);

// Update user
router.put('/:id', authMiddleware, updateUser);

// Delete user
router.delete('/:id', authMiddleware, deleteUser);

// update user profile
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, validateUserUpdate, updateProfile);

module.exports = router; 