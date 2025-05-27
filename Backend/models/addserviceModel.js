const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./userModel'); // Importing the User model to create relationship
const Category = require('./categoryModel');// Importing the Category model to create relationship


const AddService = sequelize.define('AddService', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    service_title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    provider_name: {
        type: DataTypes.STRING,
        allowNull: false,
        // We can set provider_name as auto-filled from the logged-in user
        // This will be done via the logic in the controller where user data is retrieved
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Foreign key referring to the User model
            key: 'id'
        }
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category, // Foreign key referring to the Category model
            key: 'id'
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    regular_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    member_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    available_days: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slot_1_time: {
        type: DataTypes.TIME,
        allowNull: true
    },
    slot_2_time: {
        type: DataTypes.TIME,
        allowNull: true
    },
    slot_3_time: {
        type: DataTypes.TIME,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false // No createdAt, updatedAt
});

// Define the relationships
AddService.belongsTo(User, { foreignKey: 'user_id' });
AddService.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = AddService;
