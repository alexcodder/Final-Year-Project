const express = require('express');
const router = express.Router();

// Import route handlers
const authRouter = require('./authRouter');
const userRouter = require('./userRoutes');
const patientHistoryRouter = require('./patientHistoryRoutes');
const hospitalRouter = require('./hospitalRoutes');



// Use the imported routers
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/patient-history', patientHistoryRouter);
router.use('/hospitals', hospitalRouter);

module.exports = router; 