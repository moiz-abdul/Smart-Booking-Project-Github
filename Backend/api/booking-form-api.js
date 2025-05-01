const express = require('express');
const mysql = require('mysql2/promise');
const BookingFormApi = express.Router();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'smart_booking_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// GET booking details endpoint
BookingFormApi.get('/bookingdetails/:id', async (req, res) => {
  try {
    const bookingId = req.params.id;
    
    const [bookingRows] = await pool.query(`
      SELECT b.*, s.regular_price, s.member_price 
      FROM bookingform b
      JOIN add_services s ON b.service_id = s.id
      WHERE b.id = ?
    `, [bookingId]);

    if (bookingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const bookingData = bookingRows[0];
    res.json({
      success: true,
      data: {
        ...bookingData,
        is_subscribe: bookingData.payment_type === 'Membership',
        amount_paid: bookingData.payment_type === 'Membership' 
          ? bookingData.member_price 
          : bookingData.regular_price
      }
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking details',
      error: error.message
    });
  }
});


// New endpoint to check availability
BookingFormApi.post('/check-availability', async (req, res) => {
  try {
    const { service_id, selected_day, selected_time_slot } = req.body;

    if (!service_id || !selected_day || !selected_time_slot) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if the time slot is already booked
    const [existingBookings] = await pool.query(`
      SELECT COUNT(*) as count 
      FROM bookingform 
      WHERE service_id = ? 
        AND selected_available_day = ? 
        AND selected_available_time_slot = TIME(?)
        AND is_status != 'cancel'
    `, [service_id, selected_day, selected_time_slot]);

    const isAvailable = existingBookings[0].count === 0;

    res.json({
      success: true,
      available: isAvailable,
      message: isAvailable 
        ? 'Time slot is available' 
        : 'Time slot already booked'
    });

  } catch (error) {
    console.error('Availability check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check availability',
      error: error.message
    });
  }
});

// Existing booking creation endpoint
BookingFormApi.post('/bookingdetails', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const {
      user_id,
      customer_name,
      customer_email,
      customer_phone,
      service_id,
      service_name,
      service_category,
      duration_minutes,
      start_time,
      end_time,
      selected_available_day,
      selected_available_time_slot,
      pay_per_booking_price,
      membership_price,
      payment_type,
      location,
      special_instructions,
      is_status
    } = req.body;

    // Validate required fields
    const requiredFields = [
      'user_id', 'customer_name', 'customer_email', 'customer_phone',
      'service_id', 'service_name', 'service_category', 'duration_minutes',
      'start_time', 'end_time', 'selected_available_day',
      'selected_available_time_slot', 'payment_type', 'is_status'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // First check availability again (in case of race condition)
    const [existingBookings] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM bookingform 
      WHERE service_id = ? 
        AND selected_available_day = ? 
        AND selected_available_time_slot = TIME(?)
        AND is_status != 'cancel'
    `, [service_id, selected_available_day, selected_available_time_slot]);

    if (existingBookings[0].count > 0) {
      return res.status(409).json({
        success: false,
        message: 'This time slot has already been booked by someone else'
      });
    }

    // Insert into booking_form table
    const insertQuery = `
      INSERT INTO bookingform 
      (user_id, customer_name, customer_email, customer_phone,
       service_id, service_name, service_category, duration_minutes,
       start_time, end_time, selected_available_day, 
       selected_available_time_slot, pay_per_booking_price,
       membership_price, payment_type, location,
       special_instructions, is_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 
              TIME(?), TIME(?), ?, 
              TIME(?), ?, ?, ?, 
              ?, ?, ?)
    `;

    const insertValues = [
      user_id,
      customer_name,
      customer_email,
      customer_phone,
      service_id,
      service_name,
      service_category,
      duration_minutes,
      start_time.includes(':') ? start_time.split(':').slice(0, 2).join(':') : start_time,
      end_time.includes(':') ? end_time.split(':').slice(0, 2).join(':') : end_time,
      selected_available_day,
      selected_available_time_slot.includes(':') ? selected_available_time_slot.split(':').slice(0, 2).join(':') : selected_available_time_slot,
      pay_per_booking_price,
      membership_price || null,
      payment_type,
      location || null,
      special_instructions || null,
      is_status
    ];

    const [result] = await connection.query(insertQuery, insertValues);

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking_id: result.insertId
    });

  } catch (error) {
    if (connection) await connection.rollback();
    
    console.error('Booking Creation Error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = BookingFormApi;