import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TranslatePage from './pages/TranslatePage';
import ChatbotPage from './pages/ChatbotPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import FeedPage from './pages/Feed/FeedPage';
import Navbar from './components/Layout/Navbar';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="p-4 max-w-4xl mx-auto">
        <Routes>
          <Route path="/" element={<div>
            <h1 className="text-2xl font-semibold mb-4">Línguas e Culturas de Angola</h1>
            <p className="mb-4">Promoting Angolan languages: quick links</p>
            <div className="flex gap-2">
              <Link className="btn btn-primary" to="/translate">Translator</Link>
              <Link className="btn btn-primary" to="/chatbot">Chatbot</Link>
              <Link className="btn btn-primary" to="/feed">Community Feed</Link>
            </div>
          </div>} />
          <Route path="/translate" element={<TranslatePage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/feed" element={<FeedPage />} />
        </Routes>
      </main>
    </div>
  );
}
