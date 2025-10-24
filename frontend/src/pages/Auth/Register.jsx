import React, { useState } from 'react';
import api from '../../api/axios';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { name, email, phone, password });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/';
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  }

  return (
    <div className="max-w-md mx-auto card p-4">
      <h2 className="text-lg font-semibold mb-2">Registrar</h2>
      <form onSubmit={handleRegister} className="flex flex-col gap-2">
        <input className="p-2 border rounded" placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} required />
        <input className="p-2 border rounded" placeholder="Email (opcional)" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="p-2 border rounded" placeholder="Telefone (opcional)" value={phone} onChange={e=>setPhone(e.target.value)} />
        <input type="password" className="p-2 border rounded" placeholder="Senha" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="btn btn-primary" type="submit">Criar conta</button>
      </form>
    </div>
  );
}
