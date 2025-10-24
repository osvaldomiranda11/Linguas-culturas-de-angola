import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const token = localStorage.getItem('token');
  return (
    <nav className="bg-white shadow sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex items-center justify-between p-3">
        <Link to="/" className="flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 64 64" aria-hidden>
            <rect width="64" height="64" rx="12" fill="#FDD835" />
            <circle cx="32" cy="32" r="12" fill="#2e7d32" />
          </svg>
          <span className="font-semibold">Línguas de Angola</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/translate" className="text-sm text-gray-700">Tradutor</Link>
          <Link to="/chatbot" className="text-sm text-gray-700">Chatbot</Link>
          <Link to="/feed" className="text-sm text-gray-700">Feed</Link>
          {token ? <Link to="/profile" className="ml-2 btn btn-primary">Perfil</Link> : <Link to="/auth/login" className="ml-2 btn btn-primary">Login</Link>}
        </div>
      </div>
    </nav>
  );
}
