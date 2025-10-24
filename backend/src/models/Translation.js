// backend/src/models/Translation.js
module.exports = (sequelize, DataTypes) => {
  const Translation = sequelize.define('Translation', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    source_lang: { type: DataTypes.STRING, allowNull: false },
    target_lang: { type: DataTypes.STRING, allowNull: false },
    source_text: { type: DataTypes.TEXT, allowNull: false },
    translated_text: { type: DataTypes.TEXT, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'translations',
    timestamps: false,
    indexes: [{ fields: ['source_lang', 'target_lang'] }]
  });

  Translation.lookup = async function (source_lang, target_lang, source_text) {
    return await Translation.findOne({
      where: { source_lang, target_lang, source_text }
    });
  };

  return Translation;
};
