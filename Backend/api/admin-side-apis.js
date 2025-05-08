const express = require('express');
const mysql = require('mysql2/promise');
const AdminSideApis = express.Router();
const { Parser } = require('json2csv');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'smart_booking_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Utility function to mask email
function maskEmail(email) {
  const [name, domain] = email.split('@');
  const visiblePart = name.substring(0, 3);
  return `${visiblePart}*****@${domain}`;
}

// Utility function to mask phone number
function maskPhone(phone) {
  return phone.substring(0, 2) + '*****' + phone.slice(-4);
}

// GET: Admin fetches user list with masked data
AdminSideApis.get('/adminusermanagement', async (req, res) => {
    try {
      const [users] = await pool.query('SELECT id, username, email, phoneNumber, role FROM users');
  
      const maskedUsers = users.map(user => {
        let maskedEmail = user.email;
        let maskedPhone = user.phoneNumber;
  
        // Defensive: If email or phone is corrupted
        try {
          maskedEmail = maskEmail(user.email);
        } catch (e) {
          console.warn("Invalid email format for user ID:", user.id);
          maskedEmail = 'Invalid Email';
        }
  
        try {
          maskedPhone = maskPhone(user.phoneNumber);
        } catch (e) {
          console.warn("Invalid phone number format for user ID:", user.id);
          maskedPhone = 'Invalid Phone';
        }
  
        return {
          id: user.id,
          username: user.username,
          email: maskedEmail,
          phone: maskedPhone,
          role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        };
      });
  
      res.status(200).json({ success: true, users: maskedUsers });
    } catch (err) {
      console.error('Error fetching users:', err.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });

  // Utility: Format status text

const formatStatus = (status) => {
  return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending';
};

// API: Get all reservations
AdminSideApis.get('/adminreservationmanagement', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        bf.id AS booking_id,
        u.username AS customer_name,
        bf.service_name,
        bf.service_category,
        bf.start_time,
        bf.end_time,
        bf.selected_available_day AS day,
        bf.selected_available_time_slot AS time_slot,
        bf.payment_type,
        bf.pay_per_booking_price,
        bf.membership_price,
        bf.is_status,
        bf.created_at
      FROM bookingform bf
      JOIN users u ON bf.user_id = u.id
      ORDER BY bf.created_at DESC
    `);

    const formattedData = rows.map(r => ({
      ...r,
      is_status: formatStatus(r.is_status)
    }));

    res.status(200).json({ success: true, bookings: formattedData });
  } catch (err) {
    console.error("ERROR fetching reservations:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// API: Export CSV
AdminSideApis.get('/adminreservationmanagement/export', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        bf.id AS booking_id,
        u.username AS customer_name,
        bf.service_name,
        bf.service_category,
        bf.start_time,
        bf.end_time,
        bf.selected_available_day AS day,
        bf.selected_available_time_slot AS time_slot,
        bf.payment_type,
        bf.pay_per_booking_price,
        bf.membership_price,
        bf.is_status,
        bf.created_at
      FROM bookingform bf
      JOIN users u ON bf.user_id = u.id
      ORDER BY bf.created_at DESC
    `);

    const formattedData = rows.map(r => ({
      ...r,
      is_status: formatStatus(r.is_status)
    }));

    const parser = new Parser();
    const csv = parser.parse(formattedData);

    res.header('Content-Type', 'text/csv');
    res.attachment('reservations.csv');
    return res.send(csv);
  } catch (err) {
    console.error("ERROR exporting CSV:", err);
    res.status(500).json({ success: false, message: "Failed to export CSV" });
  }
});

// GET All Reserved Periods
AdminSideApis.get('/reserved-periods', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM reserved_periods ORDER BY created_at DESC`);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching reserved periods:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//  Add New Reserved Period
AdminSideApis.post('/reserved-periods', async (req, res) => {
  const { day, start_time, end_time, reason } = req.body;

  if (!day || !start_time || !end_time) {
    return res.status(400).json({ success: false, message: "Day, start time, and end time are required" });
  }

  try {
    await pool.query(`
      INSERT INTO reserved_periods (day, start_time, end_time, reason)
      VALUES (?, ?, ?, ?)
    `, [day, start_time, end_time, reason]);

    res.json({ success: true, message: "Reserved period added successfully." });
  } catch (error) {
    console.error('Error adding reserved period:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = AdminSideApis;