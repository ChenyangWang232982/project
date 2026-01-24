const { sequelize } = require('../config/db');
const User = require('./User');
const Note = require('./Note');
//Connect User table and Note table
User.hasMany(Note, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    sourceKey: 'id'
})

Note.belongsTo(User, {
    foreignKey: 'userId',
    as: 'author',
    targetKey: 'id'
})
module.exports = {
    User,
    Note,
    sequelize 
};