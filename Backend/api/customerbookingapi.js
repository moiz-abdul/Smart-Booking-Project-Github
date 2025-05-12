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

// Get Pending bookings for customer
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

// Get confirmed bookings for customer
CustomerBookingsApi.get('/completed', async (req, res) => {
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
      AND b.is_status = 'completed'
      ORDER BY b.selected_available_day DESC
    `, [user_id]);

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching Completed bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Completed bookings',
      error: error.message
    });
  }
});


// Notifications For Customer Dashboard 
CustomerBookingsApi.get('/notifications', async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const [rows] = await pool.query(`
      SELECT b.is_status, b.service_id, b.created_at, s.provider_name, s.service_title
      FROM bookingform b
      JOIN add_services s ON s.id = b.service_id
        WHERE 
      b.user_id = ?
      AND b.is_status IN ('confirm', 'cancel', 'completed')
      AND (
        b.is_status != 'cancel' OR (b.is_status = 'cancel' AND b.cancelled_by = 'provider')
      )
      ORDER BY b.created_at DESC
      LIMIT 3
    `, [user_id]);

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
});

// Reminders For Customer Dashboard 
CustomerBookingsApi.get('/reminders', async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const [rows] = await pool.query(`
      SELECT b.start_time, b.end_time, b.service_id, s.service_title, b.created_at
      FROM bookingform b
      JOIN add_services s ON s.id = b.service_id
      WHERE b.user_id = ? AND b.is_status = 'confirm'
      ORDER BY b.created_at DESC
      LIMIT 2
    `, [user_id]);

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reminders',
      error: error.message
    });
  }
});


// Upate Cancel bookings Status for customer Cancellation 
CustomerBookingsApi.put('/:bookingId/cancel', async (req, res) => {
  try {
    const { user_id } = req.query; // Get user_id from query params
    
    if (!user_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    const [result] = await pool.execute(
  'UPDATE bookingform SET is_status = "cancel", cancelled_by = "customer" WHERE id = ? AND user_id = ?',
  [req.params.bookingId, user_id]
);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found or not owned by user' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Booking cancelled successfully' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});



// Upate Avaliable Day , Timeslot and Status bookings Pending on customer Modifications. 
// Update Booking - Updated to use params instead of req.user
CustomerBookingsApi.put('/:bookingId/update', async (req, res) => {
  try {
    const { user_id } = req.query;
    const { selected_available_day, selected_available_time_slot } = req.body;
    
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Check availability
    const [existing] = await pool.execute(
      `SELECT id FROM bookingform 
       WHERE service_id = (SELECT service_id FROM bookingform WHERE id = ?)
       AND selected_available_day = ? 
       AND selected_available_time_slot = ?
       AND is_status NOT IN ("cancel", "rejected")
       AND id != ?`,
      [req.params.bookingId, selected_available_day, selected_available_time_slot, req.params.bookingId]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'This time slot is already booked' 
      });
    }
    
    // Update booking
    const [result] = await pool.execute(
      `UPDATE bookingform SET 
        selected_available_day = ?, 
        selected_available_time_slot = ?, 
        is_status = "pending"
       WHERE id = ? AND user_id = ?`,
      [selected_available_day, selected_available_time_slot, req.params.bookingId, user_id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found or not owned by user' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Booking updated successfully. Status set to pending for provider approval.' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
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