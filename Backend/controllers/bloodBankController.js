const BloodBank = require('../models/BloodBank');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Blood Bank
exports.registerBloodBank = async (req, res) => {
    try {
        const { name, email, password, address, city, state, pincode, contactNumber } = req.body;

        // Check if blood bank already exists
        let bloodBank = await BloodBank.findOne({ email });
        if (bloodBank) {
            return res.status(400).json({ message: 'Blood bank already exists' });
        }

        // Create new blood bank
        bloodBank = new BloodBank({
            name,
            email,
            password,
            address,
            city,
            state,
            pincode,
            contactNumber
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        bloodBank.password = await bcrypt.hash(password, salt);

        await bloodBank.save();

        // Create JWT token
        const payload = {
            bloodBank: {
                id: bloodBank.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Login Blood Bank
exports.loginBloodBank = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if blood bank exists
        let bloodBank = await BloodBank.findOne({ email });
        if (!bloodBank) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, bloodBank.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const payload = {
            bloodBank: {
                id: bloodBank.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get Blood Bank Profile
exports.getBloodBankProfile = async (req, res) => {
    try {
        const bloodBank = await BloodBank.findById(req.bloodBank.id).select('-password');
        res.json(bloodBank);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update Blood Inventory
exports.updateBloodInventory = async (req, res) => {
    try {
        const { bloodGroup, quantity } = req.body;
        const bloodBank = await BloodBank.findById(req.bloodBank.id);

        const bloodIndex = bloodBank.bloodInventory.findIndex(
            item => item.bloodGroup === bloodGroup
        );

        if (bloodIndex !== -1) {
            bloodBank.bloodInventory[bloodIndex].quantity = quantity;
        } else {
            bloodBank.bloodInventory.push({ bloodGroup, quantity });
        }

        await bloodBank.save();
        res.json(bloodBank.bloodInventory);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get All Blood Banks
exports.getAllBloodBanks = async (req, res) => {
    try {
        const bloodBanks = await BloodBank.find().select('-password');
        res.json(bloodBanks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update Blood Bank Profile
exports.updateBloodBankProfile = async (req, res) => {
    try {
        const { position } = req.body;
        const bloodBank = await BloodBank.findById(req.bloodBank.id);

        if (position) {
            bloodBank.position = position;
        }

        await bloodBank.save();
        res.json(bloodBank);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getBloodInventory = async (req, res) => {
  try {
    res.json(req.bloodBank.bloodInventory);
  } catch (err) {
    res.status(500).send('Server error');
  }
};