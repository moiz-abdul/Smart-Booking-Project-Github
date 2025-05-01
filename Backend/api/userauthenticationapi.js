const express = require("express");
const jwt = require("jsonwebtoken");
const UserAuthenticationAPI = express.Router();
const targetUser = require("../models/userModel");

const JWT_SECRET = "U$erB00kinG"; // Same secret as in middleware

// RoleBases Login  API of Customer and Service Provider 

UserAuthenticationAPI.post("/login", async (req, res) => {
    const { username, password, role } = req.body;

    try {
        if (!username || !password || !role) {
            return res.status(400).json({ 
                success: false, 
                message: "Username, password, and role are required." 
            });
        }

        const user = await targetUser.findOne({ where: { username } });
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid Username or Password!" 
            });
        }

        if (user.role !== role) {
            return res.status(401).json({ 
                success: false, 
                message: "Choose Correct Role!" 
            });
        }

        if (user.password !== password) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid Username or Password!" 
            });
        }
        
        // Create JWT token
        const token = jwt.sign(
            { 
                id: user.id,
                username: user.username,
                role: user.role 
            }, 
            JWT_SECRET, 
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });

    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ 
            success: false, 
            message: "Server error. Please try again later." 
        });
    }
});

module.exports = UserAuthenticationAPI;