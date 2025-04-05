//index.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Router = require('./Routes/UserRouter.js');
const app = express();

mongoose.connect(process.env.MONGO_URI_USER)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Error connecting to MongoDB:", error));

app.use(express.json());
app.use(cors());

app.use('/api/v1/auth', Router);

app.listen(process.env.PORT, () => {
  console.log('Server is running on port 3001');
});

process.on('SIGINT', () => {
  console.log("Server is shutting down...");
  process.exit();
});
