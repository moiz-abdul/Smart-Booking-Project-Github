const express = require('express');
const mysql = require('mysql2/promise');
const CustomerBookingsApi = express.Router();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'smart_booking_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

CustomerBookingsApi.get('/pending', async (req, res) => {
  try {
    const { user_id, status } = req.query;
    
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const query = `
      SELECT 
        b.id,
        b.user_id,
        b.customer_name,
        b.customer_email,
        b.customer_phone,
        b.service_name,
        b.service_category,
        b.duration_minutes,
        b.start_time,
        b.end_time,
        b.selected_available_day,
        b.selected_available_time_slot,
        b.is_status,
        b.payment_type,
        b.location,
        b.special_instructions
      FROM bookingform b
      WHERE b.user_id = ?
      ${status ? 'AND b.is_status = ?' : ''}
      ORDER BY b.selected_available_day, b.start_time
    `;

    const queryParams = [user_id];
    if (status) queryParams.push(status);

    const [rows] = await pool.query(query, queryParams);

    // Format time values
    const formattedRows = rows.map(row => ({
      ...row,
      start_time: row.start_time ? formatTime(row.start_time) : null,
      end_time: row.end_time ? formatTime(row.end_time) : null,
      selected_available_time_slot: formatTimeSlot(row.selected_available_time_slot)
    }));

    res.json({
      success: true,
      data: formattedRows
    });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
});


// Get confirmed bookings for customer
CustomerBookingsApi.get('/confirm', async (req, res) => {
  try {
    const { user_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const [bookings] = await pool.query(`
      SELECT 
        b.*,
        s.provider_name
      FROM bookingform b
      JOIN add_services s ON b.service_id = s.id
      WHERE b.user_id = ?
      AND b.is_status = 'confirm'
      ORDER BY b.selected_available_day DESC
    `, [user_id]);

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching confirmed bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch confirmed bookings',
      error: error.message
    });
  }
});


CustomerBookingsApi.get('/cancel', async (req, res) => {
  try {
    const { user_id, status } = req.query;
    
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const query = `
      SELECT 
        b.id,
        b.user_id,
        b.customer_name,
        b.customer_email,
        b.customer_phone,
        b.service_name,
        b.service_category,
        b.duration_minutes,
        b.start_time,
        b.end_time,
        b.selected_available_day,
        b.selected_available_time_slot,
        b.is_status,
        b.payment_type,
        b.location,
        b.special_instructions
      FROM bookingform b
      WHERE b.user_id = ?
      ${status ? 'AND b.is_status = ?' : ''}
      ORDER BY b.selected_available_day, b.start_time
    `;

    const queryParams = [user_id];
    if (status) queryParams.push(status);

    const [rows] = await pool.query(query, queryParams);

    // Format time values
    const formattedRows = rows.map(row => ({
      ...row,
      start_time: row.start_time ? formatTime(row.start_time) : null,
      end_time: row.end_time ? formatTime(row.end_time) : null,
      selected_available_time_slot: formatTimeSlot(row.selected_available_time_slot)
    }));

    res.json({
      success: true,
      data: formattedRows
    });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
});

// Helper functions
function formatTime(timeString) {
  if (!timeString) return '';
  const time = new Date(`2000-01-01T${timeString}`);
  return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatTimeSlot(timeString) {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${period}`;
}

module.exports = CustomerBookingsApi;