// #ByFAV — Servidor principal do projeto "Línguas e Culturas de Angola"

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { sequelize } = require("./models");

dotenv.config();

const app = express();

// Middleware global
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🔗 Importar rotas
const authRoutes = require("./routes/auth");
const chatbotRoutes = require("./routes/chatbot");
const translateRoutes = require("./routes/translate");
const messagesRoutes = require("./routes/messages");
const postsRoutes = require("./routes/posts");
const notificationsRoutes = require("./routes/notifications");
const usersRoutes = require("./routes/users");
const languagesRoutes = require("./routes/languages");
const filesRoutes = require("./routes/files");

// 📍 Rotas base
app.use("/api/auth", authRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/languages", languagesRoutes);
app.use("/api/files", filesRoutes);

// 🧠 Rota de teste
app.get("/", (req, res) => {
  res.send("🌍 Servidor do projeto Línguas e Culturas de Angola ativo!");
});

// 🔌 Inicializar servidor
const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexão com o banco de dados estabelecida com sucesso!");

    await sequelize.sync({ alter: true });
    console.log("🧩 Tabelas sincronizadas!");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar o servidor:", error);
  }
}

startServer();
