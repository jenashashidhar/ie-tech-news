import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useNews } from '../NewsContext';
import { getCatClass, formatDate } from '../utils';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const STOP = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','is','are','was','were','has','have','its','this','that','from','by','as','it','be','not','will','also','their','they','said','more','new','says','after','into','about','over','under','when','than','been','being','which','who','had','have','would','could','should','very','just','all','one','two','can','get']);

function buildKeywordFreq(text, keywords = []) {
  const words = text.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !STOP.has(w));
  const freq = {};
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  // boost API-provided keywords
  keywords.forEach(k => { if (freq[k]) freq[k] += 2; });
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);
}

async function generateSummary(title, description) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Summarize this technology news article in 3 clear, informative sentences. Focus on what happened, why it matters, and the impact.\n\nTitle: ${title}\n\nContent: ${description}`
        }]
      })
    });
    const data = await res.json();
    return data.content?.map(c => c.text || '').join('') || null;
  } catch {
    return null;
  }
}

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { articles } = useNews();
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(true);

  const article = articles.find(a => a.id === id);

  useEffect(() => {
    if (!article) return;
    setSummary('');
    setSummaryLoading(true);

    // Try Claude API summary, fallback to first 3 sentences
    generateSummary(article.title, article.fullContent || article.description).then(result => {
      if (result) {
        setSummary(result);
      } else {
        const sentences = (article.fullContent || article.description).split(/(?<=[.!?])\s+/);
        setSummary(sentences.slice(0, 3).join(' '));
      }
      setSummaryLoading(false);
    });
  }, [article]);

  if (!article) {
    return (
      <div className="article-detail-page">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="error-box">Article not found. Please go back and try again.</div>
      </div>
    );
  }

  const textForFreq = article.fullContent || article.description || '';
  const kwFreq = buildKeywordFreq(textForFreq, article.keywords);

  const barData = {
    labels: kwFreq.map(([w]) => w),
    datasets: [{
      label: 'Frequency',
      data: kwFreq.map(([, c]) => c),
      backgroundColor: '#e24b4a99',
      borderColor: '#e24b4a',
      borderWidth: 1,
      borderRadius: 4,
    }]
  };

  return (
    <div className="article-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="article-cat">
        <span className={`cat-badge ${getCatClass(article.category)}`}>{article.category}</span>
      </div>

      <h1 className="article-title">{article.title}</h1>

      <div className="article-meta">
        <span>📰 {article.source}</span>
        {article.author && <span>✍️ {article.author}</span>}
        <span>🗓 {formatDate(article.pubDate)}</span>
        {article.country && <span>🌐 {article.country}</span>}
      </div>

      {article.image && (
        <img
          className="article-img"
          src={article.image}
          alt={article.title}
          onError={e => (e.target.style.display = 'none')}
        />
      )}

      <p className="article-body">{article.fullContent || article.description}</p>

      {/* Keywords */}
      {article.keywords?.length > 0 && (
        <div className="keywords-row">
          {article.keywords.slice(0, 10).map(k => (
            <span className="kw-chip" key={k}>{k}</span>
          ))}
        </div>
      )}

      {/* AI Summary */}
      <div className="ai-summary-card">
        <div className="ai-summary-label">✦ AI Summary</div>
        {summaryLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#aaa', fontSize: 13 }}>
            <span className="spin">↻</span> Generating summary...
          </div>
        ) : (
          <p className="ai-summary-text">{summary}</p>
        )}
      </div>

      {/* Keyword frequency chart */}
      {kwFreq.length > 0 && (
        <div className="article-chart-card">
          <div className="chart-title">Keyword frequency in article</div>
          <div style={{ height: 200 }}>
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { ticks: { font: { size: 11 } } },
                  y: { ticks: { stepSize: 1, font: { size: 11 } } }
                }
              }}
            />
          </div>
        </div>
      )}

      <a
        className="open-full-btn"
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        Read full article ↗
      </a>
    </div>
  );
}
