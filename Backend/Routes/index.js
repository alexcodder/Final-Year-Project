const express = require('express');
const router = express.Router();

// Import route handlers
const authRouter = require('./authRouter');
const userRouter = require('./userRoutes');
const patientHistoryRouter = require('./routes/patientHistoryRoutes');

// Use the imported routers
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/patient-history', patientHistoryRouter);

module.exports = router; 