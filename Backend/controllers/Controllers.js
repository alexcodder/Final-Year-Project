const { Register, Users } = require('../models/UserModel');
const bcrypt = require('bcryptjs');

//Signup
const Signup = async (req, res) => {
    try {
        const registerUser = new Register(req.body);
        const usersUser = new Users(req.body);
    
        await registerUser.save();
        await usersUser.save();
    
        // Send response
        res.status(201).json({
          message: "User created successfully in both collections",
          user: registerUser,
        });
    } catch (error) {
        console.error("Error on signup:", error); 
        res.status(400).send(error);
    }
}

//Login Api
const jwt = require('jsonwebtoken');
const Login = async (req, res) => {
    try {
        console.log("Received login request:", req.body); //debugging line
    
        const { username, password } = req.body;
    
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }
    
        const user = await Users.findOne({ username });
    
        if (!user) {
            console.log("User not found"); //debugging line
            return res.status(404).json({ message: "User not found" });
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch) {
            console.log("Wrong Password"); //debugging line
            return res.status(400).json({ message: "Wrong Password" });
        }
    
        const cookieExpiresInDays = parseInt(process.env.JWT_COOKIE_EXPIRES_IN); // Ensure this is a number
        const cookieMaxAge = cookieExpiresInDays * 24 * 60 * 60 * 1000; // Convert days to milliseconds

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.cookie('jwt', token, {
            httpOnly: process.env.JWT_COOKIE_HTTP_ONLY === 'true',
            secure: process.env.JWT_COOKIE_SECURE === 'true',
            maxAge: cookieMaxAge,
            sameSite: process.env.JWT_COOKIE_SAME_SITE === 'true' ? 'Strict' : 'Lax',
        });

        res.status(200).json({
            userId: user._id,
            role: user.role,
            message: "Login successful",
        });
    
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//get all users
const getUsers = async (req, res) => {
    try {
        // Make sure to use the correct model reference
        const users = await Users.find({}).sort({ username: 1 });
        res.status(200).send(users);
    } catch (error) {
        console.error("Error getting users:", error);
        res.status(400).send(error);
    }
}

//exports
module.exports = {
    Login,
    Signup,
    getUsers
}
