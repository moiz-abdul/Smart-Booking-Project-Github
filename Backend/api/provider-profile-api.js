const express = require('express');
const mysql = require('mysql2/promise');
const provider_profile_info = express.Router();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smart_booking_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Create or Update Profile

provider_profile_info.post('/', async (req, res) => {
    try {
        const { user_id, business_name, email, phone, address, description } = req.body;
        
        // Validation to prevent undefined values
        if (!user_id) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID is required' 
            });
        }
        
        // Replace undefined values with null for MySQL
        const safeDescription = description || null;
        const safeBusinessName = business_name || '';
        const safeEmail = email || '';
        const safePhone = phone || '';
        const safeAddress = address || '';
        
        // Check if profile exists
        const [existing] = await pool.execute(
            'SELECT * FROM provider_profile_info WHERE user_id = ?',
            [user_id]
        );

        if (existing.length > 0) {
            // Update existing profile - REMOVED THE EXTRA COMMA AFTER description = ?
            await pool.execute(
                `UPDATE provider_profile_info 
                 SET business_name = ?, email = ?, phone = ?, address = ?, 
                     description = ?
                 WHERE user_id = ?`,
                [safeBusinessName, safeEmail, safePhone, safeAddress, safeDescription, user_id]
            );
            return res.json({ success: true, message: 'Profile updated successfully' });
        } else {
            // Create new profile
            await pool.execute(
                `INSERT INTO provider_profile_info 
                 (user_id, business_name, email, phone, address, description)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [user_id, safeBusinessName, safeEmail, safePhone, safeAddress, safeDescription]
            );
            return res.json({ success: true, message: 'Profile created successfully' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Database error: ' + err.message });
    }
});

// Get Profile
provider_profile_info.get('/:user_id', async (req, res) => {
    try {
        const userId = req.params.user_id;
        
        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID is required' 
            });
        }
        
        const [results] = await pool.execute(
            'SELECT * FROM provider_profile_info WHERE user_id = ?',
            [userId]
        );
        
        if (results.length > 0) {
            res.json({ 
                success: true, 
                profile: {
                    business_name: results[0].business_name || '',
                    email: results[0].email || '',
                    phone: results[0].phone || '',
                    address: results[0].address || '',
                    description: results[0].description || ''
                }
            });
        } else {
            res.json({ success: false, message: 'No profile found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Database error: ' + err.message });
    }
});

module.exports = provider_profile_info;