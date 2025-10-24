// backend/src/models/Group.js
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    members: { type: DataTypes.TEXT, allowNull: true }, // JSON array of user ids
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'groups',
    timestamps: false
  });

  Group.prototype.addMember = async function (userId) {
    let arr = [];
    try {
      arr = this.members ? JSON.parse(this.members) : [];
    } catch (e) {
      arr = [];
    }
    if (!arr.includes(userId)) {
      arr.push(userId);
      this.members = JSON.stringify(arr);
      await this.save();
    }
    return arr;
  };

  Group.prototype.removeMember = async function (userId) {
    let arr = [];
    try {
      arr = this.members ? JSON.parse(this.members) : [];
    } catch (e) {
      arr = [];
    }
    arr = arr.filter((id) => id !== userId);
    this.members = JSON.stringify(arr);
    await this.save();
    return arr;
  };

  return Group;
};
