import React, { useState } from 'react';
import api from '../api/axios';

const LANGS = [
  { code: 'pt', name: 'Português' },
  { code: 'kmn', name: 'Kimbundu' },
  { code: 'umb', name: 'Umbundu' },
  { code: 'kng', name: 'Kikongo' }
];

export default function TranslatePage() {
  const [from, setFrom] = useState('pt');
  const [to, setTo] = useState('kmn');
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleTranslate() {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await api.post('/translate', { text, from_lang: from, to_lang: to });
      setResult(res.data);
    } catch (err) {
      alert('Translation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Tradutor</h2>
      <div className="card p-4 mb-4">
        <div className="flex gap-2 mb-2">
          <select value={from} onChange={(e)=>setFrom(e.target.value)} className="p-2 border rounded">
            {LANGS.map(l=> <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
          <select value={to} onChange={(e)=>setTo(e.target.value)} className="p-2 border rounded">
            {LANGS.map(l=> <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </div>
        <textarea value={text} onChange={(e)=>setText(e.target.value)} rows="5" className="w-full p-2 border rounded mb-2" placeholder="Digite o texto..." />
        <div className="flex gap-2">
          <button onClick={handleTranslate} className="btn btn-primary" disabled={loading}>{loading ? 'A traduzir...' : 'Traduzir'}</button>
        </div>
      </div>

      {result && (
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Tradução</h3>
          <div className="p-3 border rounded bg-gray-50">
            {result.translation}
          </div>
          <div className="text-sm text-gray-500 mt-2">Fonte: {result.cached ? 'cache' : 'motor local'} — Confiança: {result.confidence || 'n/a'}</div>
        </div>
      )}
    </div>
  );
}
