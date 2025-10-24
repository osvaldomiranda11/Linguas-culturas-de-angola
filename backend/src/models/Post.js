// backend/src/models/Post.js
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    author_id: { type: DataTypes.INTEGER, allowNull: false },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    media: { type: DataTypes.TEXT, allowNull: true }, // JSON array of URLs
    visibility: { type: DataTypes.STRING, allowNull: false, defaultValue: 'public' },
    text: { type: DataTypes.TEXT, allowNull: true },
    like_count: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    tableName: 'posts',
    timestamps: false
  });

  return Post;
};
