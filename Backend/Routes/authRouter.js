const express = require('express');
const { Login, Signup, Logout } = require('../controllers/Controllers');
const router = express.Router();

// Auth routes
router.post('/login', Login);
router.post('/signup', Signup);
router.post('/logout', Logout);

module.exports = router; 