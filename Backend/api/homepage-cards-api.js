const express = require('express');
const mysql = require('mysql2/promise');
const HomepageServicesCardApi = express.Router();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smart_booking_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Get ALL services deetails for Home PAge card on home page
HomepageServicesCardApi.get('/allservices', async (req, res) => {
    try {
        const [services] = await pool.execute(`
            SELECT s.*, c.categoryname 
            FROM add_services s
            JOIN category c ON s.category_id = c.id
            ORDER BY s.id DESC
        `);

        const formattedServices = services.map(service => ({
            id: service.id,
            serviceTitle: service.service_title,
            providerName: service.provider_name,
            category: service.categoryname,
            description: service.description,
            duration: service.duration_minutes,
            regularPrice: service.regular_price,
            memberPrice: service.member_price,
            availableDays: service.available_days ? service.available_days.split(',') : [],
            timeSlots: [
                service.slot_1_time,
                service.slot_2_time,
                service.slot_3_time
            ].filter(slot => slot),
            location: service.location || 'Not specified'
        }));

        res.status(200).json({ 
            success: true, 
            data: formattedServices 
        });

    } catch (err) {
        console.error('Database Error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch services',
            error: err.message 
        });
    }
});

// Get average ratings for all services
HomepageServicesCardApi.get('/ratings', async (req, res) => {
    try {
        const [ratings] = await pool.execute(`
            SELECT 
                service_id,
                AVG(rating) as average_rating,
                COUNT(*) as review_count
            FROM customer_reviews
            GROUP BY service_id
        `);

        // Convert to number and handle NULL cases
        const processedRatings = ratings.map(r => ({
            service_id: r.service_id,
            average_rating: r.average_rating !== null ? 
                          parseFloat(r.average_rating) : 
                          0,
            review_count: r.review_count
        }));

        res.status(200).json({ 
            success: true, 
            data: processedRatings
        });

    } catch (err) {
        console.error('Database Error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch ratings',
            error: err.message 
        });
    }
});


// Get all categories
HomepageServicesCardApi.get('/categories', async (req, res) => {
    try {
        const [categories] = await pool.execute(`
            SELECT id, categoryname 
            FROM category 
            ORDER BY id
        `);

        const formattedCategories = [
            ...categories.map(category => ({
                id: category.categoryname,
                name: category.categoryname,
                icon: getCategoryIcon(category.categoryname)
            })),
            { id: 'all', name: 'All Services', icon: '🔍' }
        ];

        res.status(200).json({ 
            success: true, 
            data: formattedCategories 
        });

    } catch (err) {
        console.error('Database Error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch categories',
            error: err.message 
        });
    }
});

// Helper function to map categories to icons
function getCategoryIcon(categoryName) {
    const iconMap = {
        'Medical Appointments': '🏥',
        'Fitness Classes': '💪',
        'Consultations': '📋',
        'Co-working Spaces': '💼',
        'Educational Services': '🎓',
        'Beauty & Wellness': '💆',
        'Event Bookings': '🎉'
    };
    return iconMap[categoryName] || '📌';
}

// Filter Category Wise Search of Service Card for Home PAGE

HomepageServicesCardApi.get('/all', async (req, res) => {
    try {
        const { category } = req.query;

        let query = `
            SELECT s.*, c.categoryname 
            FROM add_services s
            JOIN category c ON s.category_id = c.id
        `;

        let queryParams = [];

        if (category && category !== 'all') {
            query += ` WHERE c.categoryname = ?`;
            queryParams.push(category);
        }

        query += ` ORDER BY s.id DESC`;

        const [services] = await pool.execute(query, queryParams);

        const formattedServices = services.map(service => ({
            id: service.id,
            serviceTitle: service.service_title,
            providerName: service.provider_name,
            category: service.categoryname,
            description: service.description,
            duration: service.duration_minutes,
            regularPrice: service.regular_price,
            memberPrice: service.member_price,
            availableDays: service.available_days ? service.available_days.split(',') : [],
            timeSlots: [
                service.slot_1_time,
                service.slot_2_time,
                service.slot_3_time
            ].filter(slot => slot),
            location: service.location || 'Not specified'
        }));

        res.status(200).json({ 
            success: true, 
            data: formattedServices 
        });

    } catch (err) {
        console.error('Database Error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch services',
            error: err.message 
        });
    }
});

// Keyword Search API of HOME PAGE
HomepageServicesCardApi.get('/search', async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ 
                success: false, 
                message: 'Search query is required' 
            });
        }

        // Search across multiple fields
        const searchQuery = `%${query}%`;
        const [services] = await pool.execute(`
            SELECT s.*, c.categoryname 
            FROM add_services s
            JOIN category c ON s.category_id = c.id
            WHERE 
                s.service_title LIKE ? OR 
                s.provider_name LIKE ? OR 
                s.description LIKE ? OR 
                c.categoryname LIKE ? OR
                s.location LIKE ?
            ORDER BY s.id DESC
        `, [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery]);

        const formattedServices = services.map(service => ({
            id: service.id,
            serviceTitle: service.service_title,
            providerName: service.provider_name,
            category: service.categoryname,
            description: service.description,
            duration: service.duration_minutes,
            regularPrice: service.regular_price,
            memberPrice: service.member_price,
            availableDays: service.available_days ? service.available_days.split(',') : [],
            timeSlots: [
                service.slot_1_time,
                service.slot_2_time,
                service.slot_3_time
            ].filter(slot => slot),
            location: service.location || 'Not specified'
        }));

        res.status(200).json({ 
            success: true, 
            data: formattedServices 
        });

    } catch (err) {
        console.error('Database Error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to search services',
            error: err.message 
        });
    }
});


// 

// Backend API Endpoint
HomepageServicesCardApi.post('/filter', async (req, res) => {
    const { timeslots, availableDays, minRating } = req.body;
  
    let query = `
      SELECT s.*, 
             AVG(cr.rating) as average_rating, 
             COUNT(cr.id) as review_count
      FROM add_services s
      LEFT JOIN customer_reviews cr ON s.id = cr.service_id
      WHERE 1=1
    `;
  
    const queryParams = [];
  
    // Time Slots Filter
    if (timeslots && timeslots.length) {
      const timeConditions = timeslots.map(slot => {
        switch(slot) {
          case 'morning':
            return `(s.slot_1_time BETWEEN '06:00:00' AND '12:00:00' OR 
                     s.slot_2_time BETWEEN '06:00:00' AND '12:00:00' OR 
                     s.slot_3_time BETWEEN '06:00:00' AND '12:00:00')`;
          case 'afternoon':
            return `(s.slot_1_time BETWEEN '12:00:00' AND '17:00:00' OR 
                     s.slot_2_time BETWEEN '12:00:00' AND '17:00:00' OR 
                     s.slot_3_time BETWEEN '12:00:00' AND '17:00:00')`;
          case 'evening':
            return `(s.slot_1_time BETWEEN '17:00:00' AND '21:00:00' OR 
                     s.slot_2_time BETWEEN '17:00:00' AND '21:00:00' OR 
                     s.slot_3_time BETWEEN '17:00:00' AND '21:00:00')`;
          case 'night':
            return `(s.slot_1_time >= '21:00:00' OR 
                     s.slot_2_time >= '21:00:00' OR 
                     s.slot_3_time >= '21:00:00')`;
          default:
            return '';
        }
      }).filter(Boolean);
  
      if (timeConditions.length > 0) {
        query += ` AND (${timeConditions.join(' OR ')})`;
      }
    }
  
    // Available Days Filter
    if (availableDays && availableDays.length) {
      const dayConditions = availableDays.map(day =>
        `s.available_days LIKE ?`
      );
      query += ` AND (${dayConditions.join(' OR ')})`;
      availableDays.forEach(day => queryParams.push(`%${day}%`));
    }
  
    // Ratings Filter
    if (minRating) {
      query += ` GROUP BY s.id HAVING average_rating >= ?`;
      queryParams.push(parseFloat(minRating));
    } else {
      query += ` GROUP BY s.id`;
    }
  
    try {
      const [services] = await pool.execute(query, queryParams);
      res.json({ success: true, services });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });


module.exports = HomepageServicesCardApi;