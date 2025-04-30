const jwt = require('jsonwebtoken');
const BloodBank = require('../models/BloodBank');

const bloodBankAuth = async (req, res, next) => {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const bloodBankId = decoded.bloodBank?.id;
    if (!bloodBankId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    const bloodBank = await BloodBank.findById(bloodBankId).select('-password');
    if (!bloodBank) {
      return res.status(401).json({ message: 'Blood bank not found' });
    }

    req.bloodBank = bloodBank;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid', error: error.message });
  }
};

module.exports = bloodBankAuth; 