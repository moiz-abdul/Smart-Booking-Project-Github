const express = require("express");
const UpdateUserApi = express.Router();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smart_booking_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

UpdateUserApi.put('/update-role', async (req, res) => {
  const { user_id, role } = req.body;

  if (!user_id || !role || !["customer", "provider"].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role or user ID' });
  }

  try {
    await pool.query(`UPDATE users SET role = ? WHERE id = ?`, [role, user_id]);
    res.json({ success: true, message: 'User role updated successfully' });
  } catch (error) {
    console.error("Role update error:", error);
    res.status(500).json({ success: false, message: 'Failed to update role' });
  }
});


module.exports = UpdateUserApi;


// Update user status
{/* 
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

*/}