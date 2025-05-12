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

// GET reviews by service ID with provider replies
CustomerReviewsAPI.get('/:serviceId', async (req, res) => {
  const { serviceId } = req.params;

  try {
    // Get all customer reviews for the service
    const [customerReviews] = await pool.query(`
      SELECT 
        cr.id AS customer_review_id,
        cr.booking_id,
        cr.review_text AS customer_review_text,
        cr.rating,
        cr.created_at AS customer_created_at,
        u.username AS customer_name
      FROM customer_reviews cr
      JOIN users u ON cr.user_id = u.id
      WHERE cr.service_id = ?
      ORDER BY cr.created_at DESC
    `, [serviceId]);

    // Get all provider replies tied to those booking IDs
    const bookingIds = customerReviews.map(r => r.booking_id);
    let providerReplies = [];

    if (bookingIds.length > 0) {
      const [providerData] = await pool.query(`
        SELECT 
          booking_id,
          review_text AS provider_review_text,
          created_at AS provider_created_at
        FROM provider_reviews
        WHERE booking_id IN (${bookingIds.map(() => '?').join(',')})
      `, bookingIds);

      providerReplies = providerData;
    }

    // Combine reviews into a single object with optional provider_reply
    const reviewsWithReplies = customerReviews.map(cr => {
      const providerReply = providerReplies.find(pr => pr.booking_id === cr.booking_id);
      return {
        ...cr,
        provider_reply: providerReply || null
      };
    });

    res.status(200).json({
      success: true,
      reviews: reviewsWithReplies
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});


module.exports = CustomerReviewsAPI;