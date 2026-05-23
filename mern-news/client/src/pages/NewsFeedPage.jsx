import React, { useState, useMemo } from 'react';
import { useNews } from '../NewsContext';
import NewsCard from '../components/NewsCard';

export default function NewsFeedPage() {
  const { articles, loading, error, nextPage, loadMore } = useNews();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const categories = useMemo(() => {
    const cats = [...new Set(articles.map(a => a.category))];
    return ['All', ...cats];
  }, [articles]);

  const filtered = useMemo(() => {
    let list = articles;
    if (activeFilter !== 'All') list = list.filter(a => a.category === activeFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [articles, activeFilter, searchQuery]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setActiveFilter('All');
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  if (loading && articles.length === 0) {
    return (
      <div className="page">
        <div className="loading-wrap">
          <span className="spin" style={{ fontSize: 22 }}>↻</span>
          Fetching latest tech news...
        </div>
      </div>
    );
  }

  if (error && articles.length === 0) {
    return (
      <div className="page">
        <div className="error-box">
          ⚠️ Could not connect to backend: <strong>{error}</strong><br />
          <small>Make sure your server is running: <code>cd server && npm run dev</code></small>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Search */}
      <div className="search-row">
        <input
          className="search-input"
          placeholder="Search tech news..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button className="search-btn" onClick={handleSearch}>Search</button>
        {searchQuery && (
          <button className="search-btn" style={{ background: '#888' }} onClick={clearSearch}>✕ Clear</button>
        )}
      </div>

      {/* Category Filters */}
      <div className="filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={`chip ${activeFilter === cat ? 'active' : ''}`}
            onClick={() => { setActiveFilter(cat); setSearchQuery(''); setSearchInput(''); }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      {searchQuery && (
        <p style={{ fontSize: 13, color: '#888', marginBottom: '.75rem' }}>
          {filtered.length} results for "<strong>{searchQuery}</strong>"
        </p>
      )}

      {/* News Grid */}
      {filtered.length === 0 ? (
        <div className="empty">No articles found. Try a different filter or search.</div>
      ) : (
        <div className="news-grid">
          {filtered.map(a => <NewsCard key={a.id} article={a} />)}
        </div>
      )}

      {/* Load More */}
      {nextPage && !searchQuery && activeFilter === 'All' && (
        <div className="load-more-wrap">
          <button className="load-more-btn" onClick={loadMore} disabled={loading}>
            {loading ? <><span className="spin">↻</span> Loading...</> : 'Load more articles'}
          </button>
        </div>
      )}
    </div>
  );
}
