const express = require("express");
const jwt = require("jsonwebtoken");
const adminauthenticationAPI = express.Router();
const Admin = require("../models/adminModel");

const JWT_SECRET = "Book!ng$y$tem"; // Secret Key for Sign Backend API

adminauthenticationAPI.post("/superadmin/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ where: { username } });

        if (!admin) {
            return res.status(401).json({ success: false, message: "Invalid Username or Password" });
        }

        if (password !== admin.password) {
            return res.status(401).json({ success: false, message: "Invalid Username or Password" });
        }

        const payload = {
            id: admin.id,
            username: admin.username,
            role: "superadmin"
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
               
        return res.status(200).json({ 
            success: true, 
            message: "Admin Authenticated Successfully", 
            token,
            user: {
            id: admin.id,
            username: admin.username,
            role: "superadmin"
            }
  });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

module.exports = adminauthenticationAPI;
