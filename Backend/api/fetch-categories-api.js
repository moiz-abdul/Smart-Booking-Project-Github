// categoryApi.js
const express = require('express');
const mysql = require('mysql2/promise');
const CategoryApi = express.Router();

// Create MySQL Connection Pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smart_booking_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Fetch All Categories
CategoryApi.get('/', async (req, res) => {  // <== Change here
    try {
        const [categories] = await pool.execute('SELECT id, categoryname FROM category');
        res.status(200).json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = CategoryApi;
