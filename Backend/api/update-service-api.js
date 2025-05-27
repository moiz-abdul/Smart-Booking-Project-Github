const express = require('express');
const mysql = require('mysql2/promise');
const UpdateServicesApi = express.Router();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smart_booking_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// PUT update service endpoint
UpdateServicesApi.put('/:id', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const requiredFields = [
            'service_title', 'provider_name', 'user_id', 'category_id',
            'description', 'duration_minutes', 'regular_price'
        ];
        
        const missingFields = requiredFields.filter(field => req.body[field] === undefined);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        if (!req.body.slot_1_time && !req.body.slot_2_time && !req.body.slot_3_time) {
            return res.status(400).json({
                success: false,
                message: 'At least one time slot is required'
            });
        }

        const [result] = await connection.query(
            `UPDATE add_services SET ? WHERE id = ?`, [{
                ...req.body,
                available_days: req.body.available_days?.join(','),
                member_price: req.body.member_price || null,
                location: req.body.location || null
            }, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Service not found or no changes made'
            });
        }

        await connection.commit();
        res.status(200).json({
            success: true,
            message: 'Service updated successfully'
        });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Update Service Error:', error);
        res.status(500).json({
            success: false,
            message: error.code === 'ER_NO_REFERENCED_ROW_2' 
                ? 'Invalid category selected' 
                : 'Failed to update service',
            error: error.message
        });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = UpdateServicesApi;