// backend/src/models/Message.js
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sender_id: { type: DataTypes.INTEGER, allowNull: false },
    receiver_id: { type: DataTypes.INTEGER, allowNull: true },
    group_id: { type: DataTypes.INTEGER, allowNull: true },
    type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'text' },
    content: { type: DataTypes.TEXT, allowNull: false },
    metadata: { type: DataTypes.JSON, allowNull: true },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'messages',
    timestamps: false
  });

  return Message;
};
