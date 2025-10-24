// backend/src/models/User.js
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: true },
    phone: { type: DataTypes.STRING, unique: true, allowNull: true },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    bio: { type: DataTypes.TEXT, allowNull: true },
    languages: { type: DataTypes.TEXT, allowNull: true }, // JSON stringified array
    profile_photo: { type: DataTypes.STRING, allowNull: true }
  }, {
    tableName: 'users',
    timestamps: true,
    indexes: [{ unique: true, fields: ['email'] }, { unique: true, fields: ['phone'] }]
  });

  User.beforeCreate(async (user) => {
    if (user.password_hash) {
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(user.password_hash, salt);
    }
  });

  User.beforeUpdate(async (user) => {
    if (user.changed('password_hash')) {
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(user.password_hash, salt);
    }
  });

  User.prototype.validatePassword = async function (plain) {
    if (!this.password_hash) return false;
    return bcrypt.compare(plain, this.password_hash);
  };

  return User;
};
