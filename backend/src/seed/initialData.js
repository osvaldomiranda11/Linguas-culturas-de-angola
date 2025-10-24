// backend/src/seed/initialData.js
const { ChatbotContent, Translation, User } = require('../models');

(async () => {
  try {
    const count = await ChatbotContent.count();
    if (count === 0) {
      await ChatbotContent.bulkCreate([
        { question: 'Cumprimento - Olá', answer: 'Mbote (Kimbundu) / Ovule (Umbundu) — formas de dizer olá.', category: 'greetings' },
        { question: 'Obrigado', answer: 'Dikala (Kimbundu) / Katala (Umbundu) — expressões de gratidão.', category: 'politeness' },
        { question: 'Como se diz "bom dia"?', answer: 'Em Kimbundu: "mbote mbaï". Em Umbundu: "ovule wayi".', category: 'greetings' }
      ]);
      console.log('Seeded chatbot content.');
    } else {
      console.log('Chatbot content already seeded.');
    }

    const users = await User.count();
    if (users === 0) {
      await User.create({ name: 'Admin', email: 'admin@example.com', password_hash: 'adminpass' });
      console.log('Seeded admin user (password: adminpass).');
    }
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed', err);
    process.exit(1);
  }
})();
