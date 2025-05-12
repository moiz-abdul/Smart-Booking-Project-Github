const express = require('express');
const mysql = require('mysql2/promise');
const ProviderReviewsAPI = express.Router();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'smart_booking_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// POST: Provider submits a review to customer
ProviderReviewsAPI.post('/', async (req, res) => {
  try {
    const { booking_id, review_text } = req.body;

    if (!booking_id || !review_text) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID and review text are required'
      });
    }

    // Get service_id and customer_id from bookingform
    const [[booking]] = await pool.query(`
      SELECT service_id, user_id FROM bookingform WHERE id = ?`, 
      [booking_id]);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const { service_id, user_id } = booking;

    // Get customer review for this booking if exists
    const [[custReview]] = await pool.query(
      `SELECT id FROM customer_reviews WHERE booking_id = ? LIMIT 1`,
      [booking_id]
    );

    const customer_review_id = custReview ? custReview.id : null;

    // Insert provider review
    const [result] = await pool.query(`
      INSERT INTO provider_reviews (service_id, booking_id, user_id, customer_review_id, review_text)
      VALUES (?, ?, ?, ?, ?)`,
      [service_id, booking_id, user_id, customer_review_id, review_text]
    );

    res.status(201).json({
      success: true,
      message: 'Provider review submitted!',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Provider review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit provider review',
      error: error.message
    });
  }
});

module.exports = ProviderReviewsAPI;