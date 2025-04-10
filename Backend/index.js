require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Router = require('./Routes/UserRouter.js');
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI_USER) // URL from .env file
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Error connecting to MongoDB:", error)
);

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.json()); // For parsing application/json
app.use('/api/v1/auth', Router); // Use the router for authentication routes 

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
const server = app.listen(process.env.PORT, () => {
  console.log('Server is running on port 3001');
});

// shutdown mongoDB and express server
const shutdown = () => {
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
};

process.on('SIGINT', shutdown); // Listen for Ctrl+C (SIGINT)
process.on('SIGTERM', shutdown); // Listen for termination signal (SIGTERM)
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  shutdown();
});