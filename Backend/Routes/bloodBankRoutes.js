const express = require('express');
const router = express.Router();
const bloodBankController = require('../controllers/bloodBankController');
const bloodBankAuth = require('../middleware/bloodBankAuth');

// Public routes
router.post('/register', bloodBankController.registerBloodBank);
router.post('/login', bloodBankController.loginBloodBank);
router.get('/all', bloodBankController.getAllBloodBanks);

// Protected routes
router.get('/profile', bloodBankAuth, bloodBankController.getBloodBankProfile);
router.put('/profile', bloodBankAuth, bloodBankController.updateBloodBankProfile);
router.put('/inventory', bloodBankAuth, bloodBankController.updateBloodInventory);
router.get('/inventory', bloodBankAuth, bloodBankController.getBloodInventory);

module.exports = router; 