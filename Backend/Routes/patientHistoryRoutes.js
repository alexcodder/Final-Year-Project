const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createOrUpdatePatientHistory, getPatientHistory } = require("../controllers/PatientHistoryController");
const { Users } = require("../models/UserModel");;

// Get patient profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching patient profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update basic profile information
router.post("/update", authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const userId = req.user.id;

    // Find user
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update user information
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;

    // Update password if provided
    if (password) {
      // Validate password format
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~-]).{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        });
      }

      // Set the password directly - the User model's pre-save middleware will handle hashing
      user.password = password;
    }

    // Save the updated user
    await user.save();

    res.json({ 
      success: true, 
      message: "Profile updated successfully",
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get patient history
router.get("/history", authMiddleware, getPatientHistory);

// Create or update patient history
router.post("/", authMiddleware, createOrUpdatePatientHistory);

module.exports = router; 