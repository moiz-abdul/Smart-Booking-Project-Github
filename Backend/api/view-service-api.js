const express = require('express');
const mysql = require('mysql2/promise');
const ServicesApi = express.Router();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smart_booking_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


// Update Service Record API 
ServicesApi.put('/:id', async (req, res) => {
    try {
        const serviceId = req.params.id;
        const { 
            service_title, 
            category_id, 
            description, 
            duration_minutes, 
            regular_price, 
            member_price, 
            available_days, 
            slot_1_time, 
            slot_2_time, 
            slot_3_time, 
            location 
        } = req.body;

        // Validate required fields
        if (!service_title || !category_id || !description || !duration_minutes || !regular_price) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        await pool.execute(
            `UPDATE add_services 
             SET service_title = ?, 
                 category_id = ?, 
                 description = ?, 
                 duration_minutes = ?, 
                 regular_price = ?, 
                 member_price = ?, 
                 available_days = ?, 
                 slot_1_time = ?, 
                 slot_2_time = ?, 
                 slot_3_time = ?, 
                 location = ?
             WHERE id = ?`,
            [
                service_title,
                category_id,
                description,
                duration_minutes,
                regular_price,
                member_price,
                available_days,
                slot_1_time,
                slot_2_time,
                slot_3_time,
                location,
                serviceId
            ]
        );

        res.status(200).json({ 
            success: true, 
            message: 'Service updated successfully' 
        });

    } catch (err) {
        console.error('Database Error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update service',
            error: err.message 
        });
    }
});

// Get services for specific provider
ServicesApi.get('/', async (req, res) => {
    try {
        const userId = req.query.user_id;
        
        if (!userId || isNaN(userId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Valid user ID is required' 
            });
        }

        const [services] = await pool.execute(`
            SELECT s.*, c.categoryname 
            FROM add_services s
            JOIN category c ON s.category_id = c.id
            WHERE s.user_id = ?
            ORDER BY s.id DESC
        `, [userId]);

        if (services.length === 0) {
            return res.status(200).json({ 
                success: true, 
                data: [],
                message: 'No services found for this user' 
            });
        }

        const formattedServices = services.map(service => ({
            id: service.id,
            serviceTitle: service.service_title,
            serviceCategory: service.categoryname,
            serviceDescription: service.description,
            serviceDuration: service.duration_minutes,
            serviceFee: service.regular_price,
            discountedFee: service.member_price,
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

// Delete API Endpoint (Handles Bookings + Payments + Service)
ServicesApi.delete('/:id', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const { id: serviceId } = req.params;
        const userId = req.query.user_id;

        if (!userId || isNaN(userId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Valid user ID is required' 
            });
        }

        // 1. Validate ownership
        const [service] = await connection.execute(
            `SELECT id FROM add_services WHERE id = ? AND user_id = ?`,
            [serviceId, userId]
        );

        if (service.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Service not found or access denied' 
            });
        }

        // 2. Delete customer reviews (by booking IDs linked to the service)
        await connection.execute(
            `DELETE customer_reviews FROM customer_reviews
             JOIN bookingform ON bookingform.id = customer_reviews.booking_id 
             WHERE bookingform.service_id = ?`,
            [serviceId]
        );

        // 3. Delete payments linked to those bookings
        await connection.execute(
            `DELETE paymentform FROM paymentform 
             JOIN bookingform ON bookingform.id = paymentform.booking_id 
             WHERE bookingform.service_id = ?`,
            [serviceId]
        );

        // 4. Delete bookings linked to this service
        await connection.execute(
            `DELETE FROM bookingform WHERE service_id = ?`,
            [serviceId]
        );

        // 5. Finally, delete the service
        await connection.execute(
            `DELETE FROM add_services WHERE id = ?`,
            [serviceId]
        );

        await connection.commit();

        res.status(200).json({
            success: true,
            message: 'Service, associated reviews, bookings, and payments deleted successfully'
        });

    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Delete Error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to delete service data',
            error: err.message,
            code: err.code
        });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = ServicesApi;