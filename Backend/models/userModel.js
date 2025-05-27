const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    username: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    role: { 
        type: DataTypes.ENUM('customer', 'provider'), 
        allowNull: false 
    },
    is_subscribe: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    timestamps: false // ❌ disables createdAt & updatedAt
});

module.exports = User;
