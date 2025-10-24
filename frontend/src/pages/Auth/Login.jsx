import React, { useState } from 'react';
import api from '../../api/axios';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { identifier, password });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/';
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div className="max-w-md mx-auto card p-4">
      <h2 className="text-lg font-semibold mb-2">Entrar</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-2">
        <input className="p-2 border rounded" placeholder="Email ou telefone" value={identifier} onChange={e=>setIdentifier(e.target.value)} />
        <input type="password" className="p-2 border rounded" placeholder="Senha" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-primary" type="submit">Entrar</button>
      </form>
    </div>
  );
}
