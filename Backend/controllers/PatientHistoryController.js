const PatientHistory = require("../models/PatientHistoryModel");
const { Users } = require("../models/UserModel");

// Create or update patient history
exports.createOrUpdatePatientHistory = async (req, res) => {
  try {
    const userId = req.body.userId || req.user._id;
    const {
      fullName,
      dateOfBirth,
      gender,
      bloodGroup,
      height,
      weight,
      address,
      phoneNumber,
      emergencyContact,
      allergies,
      currentMedications,
      pastSurgeries,
      chronicConditions,
      familyHistory,
      lifestyle,
      username,
    } = req.body;

    // Validate required fields
    if (!fullName || !dateOfBirth || !gender || !bloodGroup || !height || !weight || !address || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Validate emergency contact
    if (!emergencyContact?.name || !emergencyContact?.relationship || !emergencyContact?.phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Please provide all emergency contact details",
      });
    }

    // Check if user exists
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find existing patient history or create new one
    let patientHistory = await PatientHistory.findOne({ user: userId });

    if (patientHistory) {
      // Update existing history
      patientHistory = await PatientHistory.findByIdAndUpdate(
        patientHistory._id,
        {
          fullName,
          dateOfBirth,
          gender,
          bloodGroup,
          height,
          weight,
          address,
          phoneNumber,
          emergencyContact,
          allergies,
          currentMedications,
          pastSurgeries,
          chronicConditions,
          familyHistory,
          lifestyle,
          username,
        },
        { new: true, runValidators: true }
      );
    } else {
      // Create new history
      patientHistory = await PatientHistory.create({
        user: userId,
        fullName,
        dateOfBirth,
        gender,
        bloodGroup,
        height,
        weight,
        address,
        phoneNumber,
        emergencyContact,
        allergies,
        currentMedications,
        pastSurgeries,
        chronicConditions,
        familyHistory,
        lifestyle,
        username,
      });
    }

    res.status(200).json({
      success: true,
      data: patientHistory,
    });
  } catch (error) {
    console.error("Error in createOrUpdatePatientHistory:", error);
    res.status(500).json({
      success: false,
      message: "Error creating/updating patient history",
      error: error.message,
    });
  }
};

// Get patient history
exports.getPatientHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const patientHistory = await PatientHistory.findOne({ user: userId });

    if (!patientHistory) {
      return res.status(404).json({
        success: false,
        message: "Patient history not found",
      });
    }

    res.status(200).json({
      success: true,
      data: patientHistory,
    });
  } catch (error) {
    console.error("Error in getPatientHistory:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching patient history",
      error: error.message,
    });
  }
}; 