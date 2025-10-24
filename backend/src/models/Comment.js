// backend/src/models/Comment.js
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    author_id: { type: DataTypes.INTEGER, allowNull: false },
    post_id: { type: DataTypes.INTEGER, allowNull: false },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    text: { type: DataTypes.TEXT, allowNull: false }
  }, {
    tableName: 'comments',
    timestamps: false
  });

  return Comment;
};
