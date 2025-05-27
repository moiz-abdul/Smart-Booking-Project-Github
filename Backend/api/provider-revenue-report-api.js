// backend/api/ProviderRevenueReportApi.js
const express = require('express');
const mysql = require('mysql2/promise');
const ProviderRevenueReportApi = express.Router();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'smart_booking_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// GET /api/revenuereport?user_id=7&from=2025-05-01&to=2025-05-31
ProviderRevenueReportApi.get('/revenuereport', async (req, res) => {
  try {
    const { user_id, from, to } = req.query;

    if (!user_id || !from || !to) {
      return res.status(400).json({ success: false, message: 'Missing parameters' });
    }

    const query = `
      SELECT 
        p.id AS payment_id,
        p.amount_paid,
        p.created_at,
        b.id AS booking_id,
        b.customer_name,
        b.service_name,
        s.service_title,
        s.provider_name
      FROM paymentform p
      JOIN bookingform b ON b.id = p.booking_id
      JOIN add_services s ON s.id = p.service_id
      WHERE s.user_id = ?
        AND p.created_at BETWEEN ? AND ?
      ORDER BY p.created_at DESC
    `;

    const [rows] = await pool.query(query, [user_id, from, to]);

    const totalRevenue = rows.reduce((total, row) => total + parseFloat(row.amount_paid), 0);

    return res.json({
      success: true,
      totalRevenue,
      data: rows,
    });
  } catch (error) {
    console.error('Revenue Report Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching revenue report',
      error: error.message,
    });
  }
});

module.exports = ProviderRevenueReportApi;