# Línguas e Culturas de Angola

Project: A full-stack web application to promote Angolan languages (Português, Kimbundu, Umbundu, Kikongo) and culture. Features include translation, an educational chatbot, user profiles, private/group messages, community feed, file uploads, and real-time notifications.

This repository includes a minimal but fully functional prototype (MVP) with:
- Backend: Node.js + Express + Sequelize (SQLite used for local ease), Socket.IO for realtime.
- Frontend: React + Vite + Tailwind CSS.

Design: Light background, colorful buttons (green, yellow, blue, red), rounded borders, clean layout inspired by Angolan motifs.

---

Features
- Translate between Portuguese and Kimbundu/Umbundu/Kikongo (rule-based dictionary + caching).
- Educational chatbot with searchable Q/A content and fallback help.
- User registration and login via email or phone (JWT).
- Community feed with posts and comments.
- File upload endpoints and local storage for media/documents.
- Real-time messaging primitives with Socket.IO (basic events).
- Mobile-friendly UI built with Tailwind.

Prerequisites
- Node.js >= 18 (recommended) and npm.
- (Optional) PostgreSQL for production; SQLite is used by default for local dev.

Installation (local)
1. Clone repository
   git clone <repo-url>
   cd <repo-root>

2. Install dependencies
   npm run install:all

3. Backend setup (local SQLite)
   - Configure env by copying backend/.env.example to backend/.env and adjust values if needed.
   - Run migrations (Sequelize sync is used):
     npm --workspace=backend run migrate
   - Seed initial data:
     npm --workspace=backend run seed

4. Start development servers
   - Start both frontend and backend concurrently:
     npm run dev
   - Alternatively run separately:
     npm --workspace=backend run dev
     npm --workspace=frontend run dev

5. Open frontend
   - Visit http://localhost:5173

Environment variables
- Backend expects (see backend/.env.example):
  - DATABASE_URL (default: sqlite:./database.sqlite)
  - JWT_SECRET
  - PORT (default: 4000)
  - FILE_STORAGE_PATH (default: ./uploads)
  - S3_* (optional for production)
  - EMAIL_SMTP_* (optional for verification emails)

API Summary
- GET /api/languages
  - Returns supported languages: pt, kmn, umb, kng
- POST /api/translate
  - Body: { text, from_lang, to_lang }
  - Response: { translation, cached, confidence }
- POST /api/auth/register
  - Body: { name, email?, phone?, password }
  - Response: { status, user_id, token }
- POST /api/auth/login
  - Body: { identifier (email or phone), password }
  - Response: { status, token, user }
- GET /api/profile/:user_id
  - Public profile info.
- PUT /api/profile (authenticated)
  - multipart/form-data: profile_photo, name, bio, languages (array or JSON)
- POST /api/messages (authenticated)
  - Body: { receiver_id | group_id, content, type }
- GET /api/messages?user1=&user2=
  - Conversation history
- POST /api/posts (authenticated)
  - multipart/form-data: text, media[]
- GET /api/posts
  - Public feed
- POST /api/files/upload (authenticated)
  - multipart/form-data file upload
- GET /api/notifications (authenticated)
  - User notifications

Database (local)
- SQLite used locally (database.sqlite). When switching to Postgres, set DATABASE_URL accordingly.
- Tables: users, messages, groups, posts, comments, notifications, translations, chatbot_content.
- Seed data available in backend/src/seed/initialData.js.

File uploads
- Saved to local folder defined by FILE_STORAGE_PATH (default ./uploads).
- Accepted types: images, pdf, docx, epub, zip, mp4.
- Max sizes set in multer configuration.

Realtime (Socket.IO)
- Server listens on same backend port.
- Client connects via socket.io-client with auth token: { auth: { token } }
- Events:
  - private_message { toUserId, content, type }
  - group_message { groupId, content, type }
  - typing { toUserId | groupId }

Security & Privacy
- Passwords hashed with bcrypt.
- JWT tokens used for authentication.
- Inputs validated with Joi at endpoints.
- File uploads validated for mime types and size.

Project Structure (key files)
- backend/
  - src/index.js — Express + Socket.IO server entry
  - src/models/* — Sequelize models
  - src/routes/* — API routers
  - src/utils/* — JWT and translation utilities
  - src/seed/initialData.js — seed data
  - .env.example — env vars template
- frontend/
  - index.html, src/main.jsx — React entry
  - src/App.jsx — Routes
  - src/pages — Translator, Chatbot, Auth, Feed pages
  - src/api/axios.js — axios instance with auth interceptors
  - src/styles/tailwind.css — theme variables & Tailwind directives

Running in Production
- Replace SQLite with PostgreSQL by setting DATABASE_URL to a proper Postgres connection string.
- Configure FILE_STORAGE_PATH or S3 env vars for uploads.
- Build frontend: npm --workspace=frontend run build
- Serve static frontend from a production Express server or CDN.
- Start backend with NODE_ENV=production and proper env vars (JWT secret, DB).

Troubleshooting
- Migration issues: ensure proper DB path and permissions. Delete database.sqlite for clean start (will erase data).
- Port conflicts: change PORT in backend/.env.example or Vite port in frontend/vite.config.js.
- File upload permissions: ensure uploads folder is writable by the process.
- JWT errors: set a strong JWT_SECRET and restart the server.

Extensibility
- Translation: swap rule-based engine with external API or ML model.
- Chatbot: integrate with LLMs or dedicated NLP services.
- Storage: integrate AWS S3 (aws-sdk present in backend deps).
- Database: migrate to PostgreSQL for production; define proper migrations and backups.

License
- MIT. See LICENSE in backend folder.

Contact & Contributions
- Contributions welcome — please open issues and PRs. For questions, edit the README or contact the maintainer in repo metadata.

Thank you for exploring "Línguas e Culturas de Angola". This prototype is intended as a starting point to preserve and teach Angolan languages and cultural expressions.
