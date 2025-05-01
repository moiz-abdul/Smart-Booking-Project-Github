// routes/services.js (Express Router)
const express = require('express');
const fetchBookingDetails = express.Router();
const mysql = require('mysql2/promise');

// Create MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smart_booking_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// GET service and provider details by service ID
fetchBookingDetails.get('/details/:id', async (req, res) => {
  const serviceId = req.params.id;

  try {
    // Fetch service data from add_services
    const [service] = await pool.query(
      "SELECT * FROM add_services WHERE id = ?",
      [serviceId]
    );

    if (service.length === 0) {
      return res.json({ success: false, message: "Service not found." });
    }

    const serviceData = service[0];

    // Fetch provider data using user_id from add_services
    const [provider] = await pool.query(
      "SELECT * FROM provider_profile_info WHERE user_id = ?",
      [serviceData.user_id]
    );

    const providerData = provider[0] || {};

    res.json({
      success: true,
      data: {
        service_title: serviceData.service_title,
        provider_name: serviceData.provider_name,
        description: serviceData.description,
        duration_minutes: serviceData.duration_minutes,
        regular_price: serviceData.regular_price,
        member_price: serviceData.member_price,
        available_days: serviceData.available_days,
        slot_1_time: serviceData.slot_1_time,
        slot_2_time: serviceData.slot_2_time,
        slot_3_time: serviceData.slot_3_time,
        location: serviceData.location,
        business_name: providerData.business_name,
        email: providerData.email,
        phone: providerData.phone,
        address: providerData.address,
        provider_description: providerData.description
      }
    });
  } catch (err) {
    console.error("Error fetching service:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = fetchBookingDetails;
