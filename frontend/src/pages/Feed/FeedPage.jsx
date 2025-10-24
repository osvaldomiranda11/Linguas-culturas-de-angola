import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  async function fetchPosts() {
    try {
      const res = await api.get('/posts');
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(()=>{ fetchPosts(); }, []);

  async function createPost(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append('text', text);
      // no media for now
      const res = await api.post('/posts', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setText('');
      fetchPosts();
    } catch (err) {
      alert('Failed to create post');
    } finally { setLoading(false); }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Feed Comunitário</h2>
      <div className="card p-4 mb-4">
        <form onSubmit={createPost} className="flex flex-col gap-2">
          <textarea value={text} onChange={e=>setText(e.target.value)} className="p-2 border rounded" placeholder="Compartilhe algo..."></textarea>
          <div className="flex gap-2">
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Publicando...' : 'Publicar'}</button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {posts.map(p => (
          <div key={p.id} className="card p-4">
            <div className="text-sm text-gray-500 mb-1">Autor: {p.author_id} • {new Date(p.timestamp).toLocaleString()}</div>
            <div>{p.text}</div>
            {p.media && p.media.length > 0 && (
              <div className="mt-2">
                {p.media.map((m,i)=> <img key={i} src={m} alt="" className="max-w-full rounded" />)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
