import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const NewsContext = createContext(null);

export function NewsProvider({ children }) {
  const [articles, setArticles] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [dateStats, setDateStats]     = useState([]);
  const [sourceStats, setSourceStats] = useState([]);
  const [total, setTotal]             = useState(0);
  const [nextPage, setNextPage]       = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [fetchedAt, setFetchedAt]     = useState(null);

  // forceRefresh = true clears cache on server, gets fresh articles
  const fetchNews = useCallback(async (forceRefresh = false, page = null) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (forceRefresh) params.set('refresh', 'true');
      if (page) params.set('page', page);

      const { data } = await axios.get(`/api/news?${params}`);
      if (!data.success) throw new Error(data.error);

      if (page) {
        // pagination — append
        setArticles(prev => [...prev, ...data.articles]);
      } else {
        setArticles(data.articles);
      }

      if (data.categoryStats) setCategoryStats(data.categoryStats);
      if (data.dateStats)     setDateStats(data.dateStats);
      if (data.sourceStats)   setSourceStats(data.sourceStats);
      setTotal(prev => page ? prev + data.articles.length : data.articles.length);
      setNextPage(data.nextPage || null);
      setFetchedAt(data.fetchedAt);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => fetchNews(true), [fetchNews]);

  const loadMore = useCallback(() => {
    if (nextPage) fetchNews(false, nextPage);
  }, [nextPage, fetchNews]);

  return (
    <NewsContext.Provider value={{
      articles, categoryStats, dateStats, sourceStats,
      total, nextPage, loading, error, fetchedAt,
      fetchNews, refresh, loadMore
    }}>
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  return useContext(NewsContext);
}
