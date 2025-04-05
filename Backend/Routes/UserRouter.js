const express = require('express');
const router = express.Router();
const { Login, Signup } = require('../controllers/Controllers');

router.post('/login', Login);

router.post('/signup', Signup);

module.exports = router;