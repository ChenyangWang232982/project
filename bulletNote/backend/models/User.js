const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || 60 * 60 * 24 * 7;

//User model
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100)
    },
}, {
    tableName: 'users',
    timestamps: true
});


User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)
});

User.beforeUpdate(async (user) => {
    if (user.changed('password')){
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt)
    }
});

User.prototype.comparePassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
}

User.prototype.generateToken = function () {
    return jwt.sign(
        {id: this.id, username: this.username}, //store them in token
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }

    );
};
module.exports = User;
module.exports.JWT_SECRET = JWT_SECRET;
module.exports.JWT_EXPIRES_IN = JWT_EXPIRES_IN;
module.exports.Op = Op;