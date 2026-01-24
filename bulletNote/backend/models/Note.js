const { DataTypes} = require('sequelize');
const { sequelize } = require('../config/db');


//Note model
const Note = sequelize.define('Note', { //type name
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(50),
        defaultValue:'default'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'

    }
}, {
    tableName: 'notes',
    timestamps: true
});



module.exports = Note;