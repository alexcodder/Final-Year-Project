const express = require('express');
const router = express.Router();
const { Login, Signup } = require('../controllers/Controllers');
const authenticate = require('../middleware/authMiddleware');

// Login route
router.post('/login', Login);

// Signup route
router.post('/signup', Signup);

router.get('/protected-route', authenticate, (req, res) => {
  res.send("You have access");
});


module.exports = router;