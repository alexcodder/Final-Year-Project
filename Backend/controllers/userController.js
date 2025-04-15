const { Users, Register } = require('../models/UserModel');
const bcrypt = require('bcryptjs');

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await Users.find({}, '-password').sort({ username: 1 });
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error.message
        });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id, '-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching user",
            error: error.message
        });
    }
};

// Create user
const createUser = async (req, res) => {
    try {
        // Check for duplicate email
        const existingEmail = await Users.findOne({ email: req.body.email.toLowerCase() });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Check for duplicate username
        const existingUsername = await Users.findOne({ username: req.body.username.toLowerCase() });
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: "Username already exists"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const userData = {
            ...req.body,
            username: req.body.username.toLowerCase(),
            email: req.body.email.toLowerCase(),
            password: hashedPassword
        };

        // Create user in both collections
        const registerUser = new Register(userData);
        const usersUser = new Users(userData);

        await registerUser.save();
        await usersUser.save();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                username: usersUser.username,
                email: usersUser.email,
                role: usersUser.role
            }
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            success: false,
            message: "Error creating user",
            error: error.message
        });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // If password is being updated, hash it
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        // Remove password from update if it's not being changed
        if (!updateData.password) {
            delete updateData.password;
        }

        const user = await Users.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({
            success: false,
            message: "Error updating user",
            error: error.message
        });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await Users.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Also delete from Register collection
        await Register.findOneAndDelete({ email: user.email });

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting user",
            error: error.message
        });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}; 