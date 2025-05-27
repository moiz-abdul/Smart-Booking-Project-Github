const { Sequelize } = require('sequelize');

// Use the correct database configuration
const sequelize = new Sequelize('smart_booking_system', 'root', '', {
  host: 'localhost', // Use the MySQL service name from docker-compose.yml
  dialect: 'mysql',
  logging: false, // Set to true if you want to see SQL queries in the console
});

// Function to connect to MySQL
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Connected Successfully!');
  } catch (error) {
    console.error('❌ MySQL Connection Error:', error);
    process.exit(1);
  }
};

// ✅ Export sequelize instance directly for models
module.exports = sequelize;

// ✅ Export connectDB separately for initializing connection
module.exports.connectDB = connectDB;
