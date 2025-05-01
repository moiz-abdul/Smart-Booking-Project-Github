const express = require('express');
const mysql = require('mysql2/promise');
const RegisterUserApi = express.Router();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smart_booking_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// RoleBases register API of Customer and Service Provider 

RegisterUserApi.post('/user/register', async (req, res) => {
    try {
        const { username, email, password, phoneNumber, role } = req.body;

        if (!username || !email || !password || !phoneNumber || !role) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const sql = `INSERT INTO users (username, email, password, phoneNumber, role) VALUES (?, ?, ?, ?, ?)`;
        const values = [username, email, password, phoneNumber, role];

        const [result] = await pool.execute(sql, values);

        res.status(201).json({ success: true, message: 'User registered successfully', userId: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Add this endpoint to your RegisterUserApi router
RegisterUserApi.get('/userdetails/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      
      const [userRows] = await pool.query(`
        SELECT id, username, email, phoneNumber AS phone, role
        FROM users
        WHERE id = ?
      `, [userId]);
  
      if (userRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
  
      const userData = userRows[0];
  
      res.json({
        success: true,
        user: userData  // matches your frontend's expectation (userResponse.data.user)
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user details',
        error: error.message
      });
    }
  });

module.exports = RegisterUserApi;
