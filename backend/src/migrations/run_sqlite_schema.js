// backend/src/migrations/run_sqlite_schema.js
/**
 * For simplicity, this script uses Sequelize sync in code.
 * Kept as an entrypoint for 'migrate' script.
 */
const { sequelize } = require('../models');

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database migrated (Sequelize sync).');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
