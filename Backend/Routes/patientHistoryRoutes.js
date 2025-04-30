const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createOrUpdatePatientHistory, getPatientHistory, getPatientProfile, updatePatientProfile } = require("../controllers/PatientController");

// Get patient profile
router.get("/profile", authMiddleware, getPatientProfile);

// Update basic profile information
router.post("/update", authMiddleware, updatePatientProfile);

// Get patient history
router.get("/history", authMiddleware, getPatientHistory);

// Create or update patient history
router.post("/", authMiddleware, createOrUpdatePatientHistory);

module.exports = router; 