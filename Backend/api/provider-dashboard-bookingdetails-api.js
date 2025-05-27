const express = require('express');
const mysql = require('mysql2/promise');
const ProviderDashboardBookingsDetailsApi = express.Router();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'smart_booking_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get pending bookings for provider's services
ProviderDashboardBookingsDetailsApi.get('/pending', async (req, res) => {
  try {
    const { user_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'Provider user_id is required'
      });
    }

    // First get all service_ids for this provider
    const [services] = await pool.query(
      'SELECT id FROM add_services WHERE user_id = ?',
      [user_id]
    );

    if (services.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }

    const serviceIds = services.map(s => s.id);
    
    // Then get pending bookings for these services
    const [bookings] = await pool.query(`
      SELECT * FROM bookingform 
      WHERE service_id IN (?) 
      AND is_status = 'pending'
      ORDER BY selected_available_day, start_time
    `, [serviceIds]);

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching provider bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
});


// Get pending bookings for provider's services
ProviderDashboardBookingsDetailsApi.get('/confirm', async (req, res) => {
  try {
    const { user_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'Provider user_id is required'
      });
    }

    // First get all service_ids for this provider
    const [services] = await pool.query(
      'SELECT id FROM add_services WHERE user_id = ?',
      [user_id]
    );

    if (services.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }

    const serviceIds = services.map(s => s.id);
    
    // Then get pending bookings for these services
    const [bookings] = await pool.query(`
      SELECT * FROM bookingform 
      WHERE service_id IN (?) 
      AND is_status = 'confirm'
      ORDER BY selected_available_day, start_time
    `, [serviceIds]);

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching provider bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
});

// Get Cancel bookings for provider's services
ProviderDashboardBookingsDetailsApi.get('/cancel', async (req, res) => {
  try {
    const { user_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'Provider user_id is required'
      });
    }

    // First get all service_ids for this provider
    const [services] = await pool.query(
      'SELECT id FROM add_services WHERE user_id = ?',
      [user_id]
    );

    if (services.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }

    const serviceIds = services.map(s => s.id);
    
    // Then get CANCELED bookings for these services
    const [bookings] = await pool.query(`
      SELECT * FROM bookingform 
      WHERE service_id IN (?) 
      AND is_status = 'cancel'
      ORDER BY selected_available_day DESC, start_time DESC
    `, [serviceIds]);

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching canceled bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch canceled bookings',
      error: error.message
    });
  }
});

{/*
// Get Completed bookings for provider's services OLD API CODE 

ProviderDashboardBookingsDetailsApi.get('/completed', async (req, res) => {
  try {
    const { user_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'Provider user_id is required'
      });
    }

    // First get all service_ids for this provider
    const [services] = await pool.query(
      'SELECT id FROM add_services WHERE user_id = ?',
      [user_id]
    );

    if (services.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }

    const serviceIds = services.map(s => s.id);
    
    // Then get CANCELED bookings for these services
    const [bookings] = await pool.query(`
      SELECT * FROM bookingform 
      WHERE service_id IN (?) 
      AND is_status = 'completed'
      ORDER BY selected_available_day DESC, start_time DESC
    `, [serviceIds]);

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching canceled bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch canceled bookings',
      error: error.message
    });
  }
});
* */}

ProviderDashboardBookingsDetailsApi.get('/completed', async (req, res) => {
  try {
    const { user_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'Provider user_id is required'
      });
    }

    // Get all service IDs for the provider
    const [services] = await pool.query(
      'SELECT id FROM add_services WHERE user_id = ?',
      [user_id]
    );

    if (services.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const serviceIds = services.map(s => s.id);

    // Fetch completed bookings with review info
    const [bookings] = await pool.query(`
      SELECT 
        b.*,

        (
          SELECT COUNT(*) 
          FROM provider_reviews pr 
          WHERE pr.booking_id = b.id
        ) AS has_provider_review,

        (
          SELECT pr.review_text
          FROM provider_reviews pr 
          WHERE pr.booking_id = b.id
          LIMIT 1
        ) AS provider_review_text

      FROM bookingform b
      WHERE b.service_id IN (?)
      AND b.is_status = 'completed'
      ORDER BY b.selected_available_day DESC, b.start_time DESC
    `, [serviceIds]);

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching completed bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch completed bookings',
      error: error.message
    });
  }
});

// Provider Navbar Notification API 
ProviderDashboardBookingsDetailsApi.get('/providernotification', async (req, res) => {
  try {
    const { user_id, since } = req.query;
    const lastReadTime = since || '1970-01-01';

    const query = `
      SELECT b.customer_name, b.service_name, b.is_status, b.created_at
      FROM bookingform b
      JOIN add_services s ON s.id = b.service_id
      WHERE s.user_id = ?
        AND b.is_status IN ('cancel', 'pending')
        AND b.created_at > ?
      ORDER BY b.created_at DESC
      LIMIT 3
    `;

    const [rows] = await pool.query(query, [user_id, lastReadTime]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Provider Notification Error:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch provider notifications',
      error: error.message
    });
  }
});




// Update booking status
ProviderDashboardBookingsDetailsApi.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['confirm', 'cancel', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    let query = 'UPDATE bookingform SET is_status = ? WHERE id = ?';
    let params = [status, id];

    // If status is cancel, also set cancelled_by = 'provider'
    if (status === 'cancel') {
      query = 'UPDATE bookingform SET is_status = ?, cancelled_by = "provider" WHERE id = ?';
    }

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: `Booking ${status}ed successfully`
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message
    });
  }
});

module.exports = ProviderDashboardBookingsDetailsApi;