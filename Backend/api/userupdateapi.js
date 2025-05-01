const express = require("express");
const UpdateUserApi = express.Router();
const RegisterUserModel = require("../models/userModel"); // Import MySQL model

// Update user status
UpdateUserApi.put('/:userId', async (req, res) => {
    try {
        // Ensure userId is properly received
        const {userId} = req.params;

        console.log("User ID is :", userId);
        if (!userId) {
            return res.status(400).json({ success: false, message: "UserId is required" });
        }

        const { status } = req.body;
        console.log("User Status is :", status);

        if (!status) {
            return res.status(400).json({ success: false, message: "Status is required" });
        }

        // Fetch user from database using Sequelize Model
        const user = await RegisterUserModel.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update user status in MySQL
        await RegisterUserModel.update(
            { status: status, updatedAt: new Date() }, // Update fields
            { where: {id: userId} } // Condition
        );

        res.status(200).json({ success: true, message: "User status updated successfully" });

    } catch (error) {
        console.error("Error updating user status:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = UpdateUserApi;
