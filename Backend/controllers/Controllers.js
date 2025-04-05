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

//Login
const Login = async (req, res) => {
    try {
        console.log("Received login request:", req.body); 
    
        const { username, password } = req.body;
    
        if (!username || !password) {
            console.log("Missing username or password");
            return res.status(400).json({ message: "Username and password are required" });
        }
    
        const user = await Users.findOne({ username });
    
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch) {
            console.log("Invalid credentials");
            return res.status(400).json({ message: "Invalid credentials" });
        }
    
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
