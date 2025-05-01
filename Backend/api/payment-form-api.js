const express = require('express');
const mysql = require('mysql2/promise');
const PaymentFormApi = express.Router();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'smart_booking_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Process payment endpoint 
PaymentFormApi.post('/process', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const {
      booking_id,
      user_id,
      is_subscribe,
      service_id,
      cardholder_name,
      card_number,
      expiry_date,
      cvv_code,
      amount_paid
    } = req.body;

    // Validate required fields
    const requiredFields = [
      'booking_id', 'user_id', 'is_subscribe', 'service_id',
      'cardholder_name', 'card_number', 'expiry_date', 'cvv_code', 'amount_paid'
    ];
    

    const missingFields = requiredFields.filter(field => req.body[field] === undefined);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Verify booking exists
    const [bookingRows] = await connection.query(
      'SELECT id FROM bookingform WHERE id = ?',
      [booking_id]
    );
    if (bookingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Get service name for confirmation
    const [serviceRows] = await connection.query(
      'SELECT service_title FROM add_services WHERE id = ?',
      [service_id]
    );
    if (serviceRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const isSubscribe = req.body.is_subscribe === 'true' || req.body.is_subscribe === true;

    // Insert payment record
    const [paymentResult] = await connection.query(`
      INSERT INTO paymentform
      (booking_id, user_id, is_subscribe, service_id,
       cardholder_name, card_number, expiry_date, cvv_code, amount_paid)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      booking_id,
      user_id,
      isSubscribe,
      service_id,
      cardholder_name,
      card_number, // Note: In production, encrypt this
      expiry_date,
      cvv_code,    // Note: In production, encrypt this
      amount_paid
    ]);

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Payment processed successfully',
      payment_id: paymentResult.insertId,
      service_name: serviceRows[0].service_title
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message
    });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = PaymentFormApi;