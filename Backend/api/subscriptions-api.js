const express = require('express');
const mysql = require('mysql2/promise');
const SubscriptionApi = express.Router();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'smart_booking_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// All subscriptions for customer (first valid per service)
SubscriptionApi.get('/subscribeusers', async (req, res) => {
  const { user_id } = req.query;

  try {
    if (!user_id) {
      return res.status(400).json({ success: false, message: "User ID required" });
    }

    const [subscriptions] = await pool.query(`
      SELECT * FROM bookingform
      WHERE 
        user_id = ? 
        AND payment_type = 'Membership'
        AND membership_start_time IS NOT NULL
        AND membership_end_time IS NOT NULL
        AND monthly_membership_fee IS NOT NULL
      ORDER BY service_id, id ASC
    `, [user_id]);

    // Map to pick first valid per service
    const uniqueServices = new Map();

    for (let sub of subscriptions) {
      if (!uniqueServices.has(sub.service_id)) {
        uniqueServices.set(sub.service_id, sub);
      }
    }

    return res.json({
      success: true,
      data: Array.from(uniqueServices.values())
    });

  } catch (error) {
    console.error("Subscriptions Fetch Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// Renew Membership API 
SubscriptionApi.put('/renewsubscription', async (req, res) => {
  const { booking_id, membership_type } = req.body;

  if (!booking_id || !membership_type) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const today = new Date();
    let endDate;

    if (membership_type === 'Monthly') {
      endDate = new Date(today);
      endDate.setDate(endDate.getDate() + 30);
    } else if (membership_type === 'Yearly') {
      endDate = new Date(today);
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      return res.status(400).json({ success: false, message: "Invalid membership type" });
    }

    await pool.query(`
      UPDATE bookingform
      SET 
        membership_type = ?,
        membership_start_time = ?,
        membership_end_time = ?
      WHERE id = ?
    `, [membership_type, today, endDate, booking_id]);

    return res.json({ success: true, message: "Membership renewed successfully!" });
  } catch (error) {
    console.error("Renew Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

// Cancel Membership API 
SubscriptionApi.put('/cancelsubsription', async (req, res) => {
  const { booking_id } = req.body;

  if (!booking_id) {
    return res.status(400).json({ success: false, message: "Booking ID is required" });
  }

  try {
    await pool.query(`
      UPDATE bookingform
      SET payment_type = 'Pay Per Booking'
      WHERE id = ?
    `, [booking_id]);

    res.json({ success: true, message: 'Membership cancelled successfully.' });
  } catch (error) {
    console.error("Cancel Membership Error:", error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = SubscriptionApi;