const express = require('express');
const mysql = require('mysql2/promise');
const AddServiceApi = express.Router();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'smart_booking_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// GET categories endpoint
AddServiceApi.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, categoryname FROM category');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

// Stored the data into add services table
AddServiceApi.post('/serviceprovider', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const {
      service_title,
      provider_name,
      user_id,
      category_id,
      description,
      duration_minutes,
      regular_price,
      member_price,
      available_days,
      slot_1_time,
      slot_2_time,
      slot_3_time,
      location
    } = req.body;

    // Validate required fields
    const requiredFields = [
      'service_title', 'provider_name', 'user_id', 'category_id',
      'description', 'duration_minutes', 'regular_price'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate category exists
    const [categoryCheck] = await connection.query(
      'SELECT id FROM category WHERE id = ?',
      [category_id]
    );

    if (categoryCheck.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category selected'
      });
    }

    // Validate at least one time slot
    if (!slot_1_time && !slot_2_time && !slot_3_time) {
      return res.status(400).json({
        success: false,
        message: 'At least one time slot is required'
      });
    }

    // Insert into add_service table
    const insertQuery = `
      INSERT INTO add_services 
      (service_title, provider_name, user_id, category_id, description, 
       duration_minutes, regular_price, member_price, available_days, 
       slot_1_time, slot_2_time, slot_3_time, location) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const insertValues = [
      service_title,
      provider_name,
      user_id,
      category_id,
      description,
      duration_minutes,
      regular_price,
      member_price || null,
      available_days || '',
      slot_1_time || null,
      slot_2_time || null,
      slot_3_time || null,
      location || null
    ];

    const [result] = await connection.query(insertQuery, insertValues);

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Service added successfully',
      data: {
        id: result.insertId,
        ...req.body
      }
    });
  } catch (error) {
    if (connection) await connection.rollback();
    
    console.error('Add Service Error:', error);
    
    let statusCode = 500;
    let errorMessage = 'Failed to add service';

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      statusCode = 400;
      errorMessage = 'Invalid category selected';
    } else if (error.code === 'ER_TRUNCATED_WRONG_VALUE') {
      statusCode = 400;
      errorMessage = 'Invalid data format provided';
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: error.message,
      code: error.code
    });
  } finally {
    if (connection) connection.release();
  }
});


// API for fetching details for Booking Form page. 

AddServiceApi.get('/servicedetails/:id', async (req, res) => {
  try {
    const serviceId = req.params.id;
    
    // First get the service details
    const [serviceRows] = await pool.query(`
      SELECT s.*, c.categoryname 
      FROM add_services s
      LEFT JOIN category c ON s.category_id = c.id
      WHERE s.id = ?
    `, [serviceId]);

    if (serviceRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const serviceData = serviceRows[0];

    res.json({
      success: true,
      data: serviceData
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service details',
      error: error.message
    });
  }
});

// API for Fetcing Details for Add Service EDITING 

AddServiceApi.get('/editservicedetails/:id', async (req, res) => {
  try {
      const [service] = await pool.query(`
          SELECT s.*, c.categoryname 
          FROM add_services s
          LEFT JOIN category c ON s.category_id = c.id
          WHERE s.id = ?
      `, [req.params.id]);

      if (service.length === 0) {
          return res.status(404).json({ 
              success: false, 
              message: 'Service not found' 
          });
      }

      res.json({ 
          success: true, 
          data: {
              ...service[0],
              available_days: service[0].available_days || ''
          }
      });
  } catch (error) {
      console.error('Error fetching service:', error);
      res.status(500).json({ 
          success: false, 
          message: 'Failed to fetch service',
          error: error.message 
      });
  }
});

module.exports = AddServiceApi;