import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { NewsProvider, useNews } from './NewsContext';
import Navbar from './components/Navbar';
import NewsFeedPage from './pages/NewsFeedPage';
import AnalyticsPage from './pages/AnalyticsPage';
import TrendsPage from './pages/TrendsPage';
import ArticlePage from './pages/ArticlePage';

function AppInner() {
  const { fetchNews, refresh, total, loading } = useNews();
  const location = useLocation();

  // Initial load
  useEffect(() => {
    fetchNews(true); // always get fresh news on app mount
  }, []);

  return (
    <>
      <Navbar total={total} loading={loading} onRefresh={refresh} />
      <Routes>
        <Route path="/" element={<NewsFeedPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/trends" element={<TrendsPage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <NewsProvider>
        <AppInner />
      </NewsProvider>
    </BrowserRouter>
  );
}
