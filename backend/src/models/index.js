// backend/src/models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:./database.sqlite';

const sequelize = new Sequelize(DATABASE_URL, {
  logging: false
});

const User = require('./User')(sequelize, DataTypes);
const Message = require('./Message')(sequelize, DataTypes);
const Group = require('./Group')(sequelize, DataTypes);
const Post = require('./Post')(sequelize, DataTypes);
const Comment = require('./Comment')(sequelize, DataTypes);
const Notification = require('./Notification')(sequelize, DataTypes);
const Translation = require('./Translation')(sequelize, DataTypes);
const ChatbotContent = require('./ChatbotContent')(sequelize, DataTypes);

// Associations
User.hasMany(Post, { foreignKey: 'author_id', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

Post.hasMany(Comment, { foreignKey: 'post_id', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });
Comment.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });
Message.belongsTo(Group, { foreignKey: 'group_id', as: 'group' });

Group.belongsToMany(User, { through: 'GroupMembers', foreignKey: 'groupId', otherKey: 'userId', as: 'members' });

User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Message,
  Group,
  Post,
  Comment,
  Notification,
  Translation,
  ChatbotContent
};
