import React, { useEffect, useState } from 'react';
import PostCard from './components/PostCard2';

function AddNewForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!title && !body) return;
    onAdd({ title, body });
    setTitle('');
    setBody('');
  };

  return (
    <form
      onSubmit={submit}
      style={{
        display: 'flex',
        gap: 8,
        flexDirection: 'column',
        maxWidth: 600,
      }}
    >
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="page-button">
          Add post
        </button>
        <button
          type="button"
          className="page-button"
          onClick={() => {
            setTitle('');
            setBody('');
          }}
        >
          Clear
        </button>
      </div>
    </form>
  );
}

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBody, setShowBody] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((res) => {
        if (!res.ok) throw new Error('response was not ok');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          // augment posts with client-side flags
          setPosts(data.map((p) => ({ ...p, disabled: false })));
          setCurrentPage(1);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="center">Loading posts...</div>;
  if (error) return <div className="center error">Error: {error}</div>;

  // filter posts by search term (case-insensitive)
  const searchTerm = search.trim().toLowerCase();
  const filtered = searchTerm
    ? posts.filter((p) => (p.title || '').toLowerCase().includes(searchTerm))
    : posts;

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(total, currentPage * pageSize);
  const visible = filtered.slice(startIndex, endIndex);

  function clampPage(p, totalCount) {
    const pages = Math.max(1, Math.ceil(totalCount / pageSize));
    return Math.min(Math.max(1, p), pages);
  }

  const handleSave = (id, updated) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
  };

  const handleDelete = (id) => {
    setPosts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      setCurrentPage((cur) => clampPage(cur, next.length));
      return next;
    });
  };

  const handleToggleDisable = (id) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, disabled: !p.disabled } : p))
    );
  };

  const handleAddAfter = (id, newPost) => {
    setPosts((prev) => {
      const maxId = prev.reduce((m, x) => Math.max(m, x.id), 0);
      const created = {
        id: maxId + 1,
        title: newPost.title || 'Untitled',
        body: newPost.body || '',
        disabled: false,
      };
      const idx = prev.findIndex((p) => p.id === id);
      const copy = prev.slice();
      copy.splice(idx + 1, 0, created);
      return copy;
    });
  };

  const handleAddNew = (newPost) => {
    setPosts((prev) => {
      const maxId = prev.reduce((m, x) => Math.max(m, x.id), 0);
      const created = {
        id: maxId + 1,
        title: newPost.title || 'Untitled',
        body: newPost.body || '',
        disabled: false,
      };
      const copy = [created, ...prev];
      setCurrentPage(1);
      return copy;
    });
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Posts</h1>
        <div className="header-controls">
          <div className="search-wrap">
            <input
              className="search-input"
              placeholder="Search title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button
              className="page-button search-clear"
              onClick={() => {
                setSearch('');
                setCurrentPage(1);
              }}
              title="Clear search"
            >
              Clear
            </button>
          </div>

          <label style={{ marginLeft: 12 }}>
            <input
              type="checkbox"
              checked={showBody}
              onChange={() => setShowBody((s) => !s)}
            />
            Show body
          </label>
        </div>
      </header>

      <div className="grid">
        {visible.map((p) => (
          <PostCard
            key={p.id}
            id={p.id}
            title={p.title}
            body={p.body}
            showBody={showBody}
            highlight={p.id % 2 === 0}
            disabled={p.disabled}
            onSave={handleSave}
            onDelete={handleDelete}
            onToggleDisable={handleToggleDisable}
            onAddAfter={handleAddAfter}
          />
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <details>
          <summary style={{ cursor: 'pointer', marginBottom: 8 }}>
            Add new post
          </summary>
          <AddNewForm onAdd={handleAddNew} />
        </details>
      </div>

      <div className="pagination-wrap">
        <div className="pagination-info">
          Showing {startIndex + 1}–{endIndex} of {total}
        </div>
        <div className="pagination">
          <button
            className="page-button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                className={
                  'page-button' + (page === currentPage ? ' active' : '')
                }
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            );
          })}

          <button
            className="page-button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
