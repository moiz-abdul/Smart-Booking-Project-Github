const express = require('express');
const mysql = require('mysql2/promise');
const CustomerReviewsAPI = express.Router();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'smart_booking_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

CustomerReviewsAPI.post('/', async (req, res) => {
  try {
    const { service_id, booking_id, user_id, rating, review_text } = req.body;

    // Validate required fields
    if (!service_id || !user_id || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Service ID, User ID and Rating are required'
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO customer_reviews 
      (service_id, booking_id, user_id, rating, review_text)
      VALUES (?, ?, ?, ?, ?)`,
      [service_id, booking_id, user_id, rating, review_text]
    );

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        id: result.insertId
      }
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review',
      error: error.message
    });
  }
});

// GET Reviews by Service ID
CustomerReviewsAPI.get('/:serviceId', async (req, res) => {
  const { serviceId } = req.params;

  try {
    const [reviews] = await pool.query(`
      SELECT 
        cr.id,
        cr.review_text,
        cr.rating,
        cr.created_at,
        u.username
      FROM customer_reviews cr
      JOIN users u ON cr.user_id = u.id
      WHERE cr.service_id = ?
      ORDER BY cr.created_at DESC
    `, [serviceId]);

    res.status(200).json({
      success: true,
      reviews
    });

  } catch (error) {
    console.error('Error fetching customer reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});


module.exports = CustomerReviewsAPI;