const { Register, Users } = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function for error responses
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
        const { username, email, password, role } = req.body;

        // Validate required fields
        if (!username || !email || !password || !role) {
            return sendErrorResponse(res, 400, "All fields are required");
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return sendErrorResponse(res, 400, "Invalid email format");
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

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password: hashedPassword,
            role: role.toLowerCase()
        };

        // Create user in both collections
        const registerUser = new Register(userData);
        const usersUser = new Users(userData);

        await registerUser.save();
        await usersUser.save();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: registerUser._id,
                username: registerUser.username,
                email: registerUser.email,
                role: registerUser.role
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

        // Validate input
        if (!username || !password) {
            return sendErrorResponse(res, 400, "Username and password are required");
        }

        // Find user in Users collection
        const user = await Users.findOne({ username: username.toLowerCase() });
        if (!user) {
            return sendErrorResponse(res, 401, "Invalid credentials");
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendErrorResponse(res, 401, "Invalid credentials");
        }

        // Also find user in Register collection to make sure we have the right records
        const registerUser = await Register.findOne({ username: username.toLowerCase() });
        
        // Use the correct user object for ID
        const userId = registerUser ? registerUser._id : user._id;
        
        // Generate token
        const token = jwt.sign(
            {
                id: userId,
                role: user.role,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Log token details for debugging
        console.log('Generated token:', {
            payload: {
                id: userId,
                role: user.role,
                username: user.username
            },
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        // Set cookie with 1 minute expiration
        const oneMinuteFromNow = new Date(Date.now() + 60 * 1000); // Current time + 1 minute
        
        // Enhanced cookie settings for development environment
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: false, // Must be false for non-HTTPS localhost
            expires: oneMinuteFromNow,
            sameSite: 'Lax', // Using 'Lax' for development environment
            path: '/'
        });

        // DEBUGGING: Log the Set-Cookie header
        console.log('Set-Cookie Header:', res.getHeader('Set-Cookie'));

        // Send response
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: userId,
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
        const users = await Users.find({}, '-password').sort({ username: 1 });
        res.status(200).json({
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
        const user = await Users.findById(req.params.id, '-password');
        if (!user) {
            return sendErrorResponse(res, 404, "User not found");
        }
        res.status(200).json({
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

        res.status(200).json({
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

        // Delete from both collections
        await Users.findByIdAndDelete(req.params.id);
        await Register.findOneAndDelete({ email: user.email });

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
        // Clear the JWT cookie by setting an expired date
        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0), // Set expiration to epoch time
            secure: false,
            sameSite: 'Lax',
            path: '/' // Important for proper cookie removal
        });

        // Send success response
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
