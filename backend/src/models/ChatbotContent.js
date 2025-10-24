// backend/src/models/ChatbotContent.js
module.exports = (sequelize, DataTypes) => {
  const ChatbotContent = sequelize.define('ChatbotContent', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    question: { type: DataTypes.TEXT, allowNull: false },
    answer: { type: DataTypes.TEXT, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: true }
  }, {
    tableName: 'chatbot_content',
    timestamps: false
  });

  return ChatbotContent;
};
