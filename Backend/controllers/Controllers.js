const { Users } = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// error responses
const sendErrorResponse = (res, status, message, error = null) => {
    console.error(message, error ? error : '');
    return res.status(status).json({
        success: false,
        message,
        error: error ? error.message : undefined
    });
};

// Signup
const Signup = async (req, res) => {
    try {
        const { name, email, username, password, role } = req.body;

        // Validate required fields
        if (!name || !email || !username || !password || !role) {
            return sendErrorResponse(res, 400, "All fields are required");
        }

        // Validate role
        const validRoles = ['patient', 'ambulance', 'hospital', 'bloodbank'];
        if (!validRoles.includes(role.toLowerCase())) {
            return sendErrorResponse(res, 400, "Invalid role selected");
        }

        // Check for duplicate email
        const existingEmail = await Users.findOne({ email: email.toLowerCase() });
        if (existingEmail) {
            return sendErrorResponse(res, 400, "Email already exists");
        }

        // Check for duplicate username
        const existingUsername = await Users.findOne({ username: username.toLowerCase() });
        if (existingUsername) {
            return sendErrorResponse(res, 400, "Username already exists");
        }

        const userData = {
            name,
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password: password,
            role: role.toLowerCase()
        };

        // Create user
        const user = new Users(userData);
        await user.save();

        // Generate token
        const token = jwt.sign(
            { 
                id: user._id,
                role: user.role,
                username: user.username
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        sendErrorResponse(res, 500, "Error during signup", error);
    }
};

// Login
const Login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return sendErrorResponse(res, 400, "Username and password are required");
        }
    
        // Find user
        const user = await Users.findOne({ username: username.toLowerCase() });
    
        if (!user) {
            return sendErrorResponse(res, 401, "Invalid credentials");
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendErrorResponse(res, 401, "Invalid credentials");
        }
        
        // Generate token
        const token = jwt.sign(
            { 
                id: user._id,
                role: user.role,
                username: user.username
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.json({
            success: true,
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                email: user.email
            }
        });
    } catch (error) {
        sendErrorResponse(res, 500, "Error during login", error);
    }
};

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await Users.find().select('-password').sort({ username: 1 });
        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        sendErrorResponse(res, 500, "Error fetching users", error);
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id).select('-password');
        if (!user) {
            return sendErrorResponse(res, 404, "User not found");
        }
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        sendErrorResponse(res, 500, "Error fetching user", error);
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // Remove sensitive fields
        delete updateData.password;
        delete updateData._id;

        // If email is being updated, check for duplicates
        if (updateData.email) {
            const existingEmail = await Users.findOne({
                email: updateData.email.toLowerCase(),
                _id: { $ne: id }
            });
            if (existingEmail) {
                return sendErrorResponse(res, 400, "Email already exists");
            }
            updateData.email = updateData.email.toLowerCase();
        }

        // If username is being updated, check for duplicates
        if (updateData.username) {
            const existingUsername = await Users.findOne({
                username: updateData.username.toLowerCase(),
                _id: { $ne: id }
            });
            if (existingUsername) {
                return sendErrorResponse(res, 400, "Username already exists");
            }
            updateData.username = updateData.username.toLowerCase();
        }

        const user = await Users.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return sendErrorResponse(res, 404, "User not found");
        }

        res.json({
            success: true,
            message: "User updated successfully",
            data: user
        });
    } catch (error) {
        sendErrorResponse(res, 500, "Error updating user", error);
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id);
        if (!user) {
            return sendErrorResponse(res, 404, "User not found");
        }

        await Users.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        sendErrorResponse(res, 500, "Error deleting user", error);
    }
};

// Logout
const Logout = (req, res) => {
    try {
        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0),
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        sendErrorResponse(res, 500, 'Error during logout', error);
    }
};

module.exports = {
    Login,
    Signup,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    Logout
};
