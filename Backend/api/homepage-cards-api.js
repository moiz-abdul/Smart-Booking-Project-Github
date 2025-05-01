const express = require('express');
const mysql = require('mysql2/promise');
const HomepageServicesCardApi = express.Router();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smart_booking_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Get ALL services for home page
HomepageServicesCardApi.get('/all', async (req, res) => {
    try {
        const [services] = await pool.execute(`
            SELECT s.*, c.categoryname 
            FROM add_services s
            JOIN category c ON s.category_id = c.id
            ORDER BY s.id DESC
        `);

        const formattedServices = services.map(service => ({
            id: service.id,
            serviceTitle: service.service_title,
            providerName: service.provider_name,
            category: service.categoryname,
            description: service.description,
            duration: service.duration_minutes,
            regularPrice: service.regular_price,
            memberPrice: service.member_price,
            availableDays: service.available_days ? service.available_days.split(',') : [],
            timeSlots: [
                service.slot_1_time,
                service.slot_2_time,
                service.slot_3_time
            ].filter(slot => slot),
            location: service.location || 'Not specified'
        }));

        res.status(200).json({ 
            success: true, 
            data: formattedServices 
        });

    } catch (err) {
        console.error('Database Error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch services',
            error: err.message 
        });
    }
});

module.exports = HomepageServicesCardApi;