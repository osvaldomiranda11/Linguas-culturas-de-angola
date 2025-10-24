import React, { useState } from 'react';
import api from '../api/axios';

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Olá! Pergunte-me sobre palavras, expressões ou cultura angolana.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function send() {
    const text = input.trim();
    if (!text) return;
    setMessages(m => [...m, { from: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const res = await api.post('/chatbot/query', { text });
      setMessages(m => [...m, { from: 'bot', text: res.data.answer }]);
    } catch (err) {
      setMessages(m => [...m, { from: 'bot', text: 'Desculpe, erro ao contactar o chatbot.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Chatbot Educacional</h2>
      <div className="card p-4 mb-4" style={{maxHeight: '60vh', overflow: 'auto'}}>
        {messages.map((m, i) => (
          <div key={i} className={`mb-3 ${m.from === 'bot' ? 'text-left' : 'text-right'}`}>
            <div className={`inline-block p-3 rounded-lg ${m.from === 'bot' ? 'bg-gray-100' : 'bg-blue-500 text-white'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Pergunte algo sobre línguas/cultura..." />
        <button onClick={send} className="btn btn-primary" disabled={loading}>{loading ? 'A processar...' : 'Enviar'}</button>
      </div>
    </div>
  );
}
