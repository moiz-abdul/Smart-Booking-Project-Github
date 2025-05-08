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

// Check Reserved Timeslot of the day by Admin SIDE
BookingFormApi.post('/check-reserved-period', async (req, res) => {
  const { selected_day, selected_start_time, selected_end_time } = req.body;

  if (!selected_day || !selected_start_time || !selected_end_time) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  try {
    const [rows] = await pool.query(
      `SELECT * FROM reserved_periods 
       WHERE day = ? 
       AND (
         (start_time <= ? AND end_time > ?) OR
         (start_time < ? AND end_time >= ?) OR
         (start_time >= ? AND end_time <= ?)
       )`,
      [selected_day, selected_start_time, selected_start_time, selected_end_time, selected_end_time, selected_start_time, selected_end_time]
    );

    if (rows.length > 0) {
      return res.json({
        success: true,
        is_reserved: true,
        reason: rows[0].reason || "Time falls in unavailable admin slot"
      });
    }

    return res.json({ success: true, is_reserved: false });
  } catch (err) {
    console.error("Reserved period check failed:", err);
    res.status(500).json({ success: false, message: "Server error while checking reserved times" });
  }
});

// check availability of the timslot already booked or not
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

// Check Membership Status
BookingFormApi.post('/check-membership', async (req, res) => {
  try {
    const { user_id, service_id } = req.body;
    
    const [membershipRows] = await pool.query(`
      SELECT * FROM bookingform 
      WHERE user_id = ? 
      AND service_id = ? 
      AND payment_type = 'Membership' 
      AND membership_end_time > NOW()
    `, [user_id, service_id]);

    res.json({
      success: true,
      has_active_membership: membershipRows.length > 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check membership'
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
      is_status,

      membership_type,
      membership_start_time,
      membership_end_time,
      monthly_membership_fee,
      yearly_membership_fee
    } = req.body;

    // Modify required fields validation
    const requiredFields = [
      'user_id', 'customer_name', 'customer_email', 'customer_phone',
      'service_id', 'service_name', 'service_category', 'duration_minutes',
      'start_time', 'end_time', 'selected_available_day',
      'selected_available_time_slot', 'is_status'
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
       special_instructions, is_status,
       membership_type, membership_start_time, membership_end_time,
       monthly_membership_fee, yearly_membership_fee)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 
              TIME(?), TIME(?), ?, 
              TIME(?), ?, ?, ?, 
              ?, ?, ?,
              ?, ?, ?, ?, ?)
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
      payment_type || null,
      location || null,
      special_instructions || null,
      is_status,
      membership_type || null,
      membership_start_time || null,
      membership_end_time || null,
      monthly_membership_fee || null,
      yearly_membership_fee || null

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

// New endpoint to get server time
BookingFormApi.get('/server-time', async (req, res) => {
  try {
    const [serverTimeResult] = await pool.query('SELECT NOW() as timestamp');
    res.json({
      success: true,
      timestamp: serverTimeResult[0].timestamp
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch server time'
    });
  }
});


// GET booking details for Updating Booking Form on Customer Dashboard 
BookingFormApi.get('/updateform/bookingdetails/:id', async (req, res) => {
  try {
    const serviceId = req.params.id;
    
    // 1. Get service details
    const [serviceRows] = await pool.query(`
      SELECT 
        s.*, 
        c.categoryname,
        s.available_days,
        s.slot_1_time,
        s.slot_2_time,
        s.slot_3_time
      FROM add_services s
      JOIN category c ON s.category_id = c.id
      WHERE s.id = ?
    `, [serviceId]);

    if (serviceRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const serviceData = serviceRows[0];
    
    // 2. Parse available days and time slots
    const availableDays = serviceData.available_days 
      ? serviceData.available_days.split(',').map(day => day.trim())
      : [];
      
    const timeSlots = [
      serviceData.slot_1_time,
      serviceData.slot_2_time,
      serviceData.slot_3_time
    ].filter(slot => slot);

    // 3. Prepare response data
    const responseData = {
      service_id: serviceData.id,
      service_title: serviceData.service_title,
      provider_name: serviceData.provider_name,
      category: serviceData.categoryname,
      description: serviceData.description,
      duration_minutes: serviceData.duration_minutes,
      regular_price: serviceData.regular_price,
      member_price: serviceData.member_price,
      available_days: availableDays,
      time_slots: timeSlots.filter(slot => slot && slot.trim() !== ''), // Ensure non-empty slots
      location: serviceData.location
    };

    res.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Error fetching service details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service details',
      error: error.message
    });
  }
});

module.exports = BookingFormApi;