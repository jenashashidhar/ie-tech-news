import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement, BarElement, LineElement, PointElement,
  CategoryScale, LinearScale,
  Tooltip, Legend, Filler
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { useNews } from '../NewsContext';
import { CAT_COLORS, formatDate } from '../utils';

ChartJS.register(
  ArcElement, BarElement, LineElement, PointElement,
  CategoryScale, LinearScale,
  Tooltip, Legend, Filler
);

export default function AnalyticsPage() {
  const { articles, categoryStats, dateStats, sourceStats, loading, fetchedAt } = useNews();

  if (loading && articles.length === 0) {
    return (
      <div className="analytics-page">
        <div className="loading-wrap"><span className="spin">↻</span> Loading analytics...</div>
      </div>
    );
  }

  const catLabels  = categoryStats.map(s => s.name);
  const catValues  = categoryStats.map(s => s.count);
  const catColors  = catLabels.map(l => CAT_COLORS[l] || '#888');

  const dateLabels = dateStats.map(s => s.date);
  const dateValues = dateStats.map(s => s.count);

  const srcLabels  = sourceStats.slice(0, 8).map(s => s.name);
  const srcValues  = sourceStats.slice(0, 8).map(s => s.count);

  const topCat   = categoryStats[0];
  const topSrc   = sourceStats[0];
  const totalArt = articles.length;

  const doughnutData = {
    labels: catLabels,
    datasets: [{
      data: catValues,
      backgroundColor: catColors,
      borderWidth: 2,
      borderColor: '#fff',
    }]
  };

  const barCatData = {
    labels: catLabels,
    datasets: [{
      label: 'Articles',
      data: catValues,
      backgroundColor: catColors,
      borderRadius: 5,
      borderSkipped: false,
    }]
  };

  const lineData = {
    labels: dateLabels,
    datasets: [{
      label: 'Articles published',
      data: dateValues,
      borderColor: '#e24b4a',
      backgroundColor: 'rgba(226,75,74,0.12)',
      fill: true,
      tension: 0.35,
      pointBackgroundColor: '#e24b4a',
      pointRadius: 5,
      pointHoverRadius: 7,
    }]
  };

  const barSrcData = {
    labels: srcLabels,
    datasets: [{
      label: 'Articles',
      data: srcValues,
      backgroundColor: '#378add99',
      borderColor: '#378add',
      borderWidth: 1,
      borderRadius: 4,
    }]
  };

  const sharedOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  return (
    <div className="analytics-page">
      <h1 className="page-title">📊 Analytics</h1>
      {fetchedAt && (
        <p style={{ fontSize: 12, color: '#aaa', marginBottom: '1rem' }}>
          Data fetched at {new Date(fetchedAt).toLocaleTimeString('en-IN')}
        </p>
      )}

      {/* Stat cards */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total articles</div>
          <div className="stat-val">{totalArt}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Categories</div>
          <div className="stat-val">{categoryStats.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Top category</div>
          <div className="stat-val sm">{topCat?.name || '—'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Top source</div>
          <div className="stat-val sm">{topSrc?.name || '—'}</div>
        </div>
      </div>

      {/* Row 1: Doughnut + Bar */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">Articles by category</div>
          <div className="pie-legend">
            {catLabels.map((l, i) => (
              <div className="leg-item" key={l}>
                <div className="leg-dot" style={{ background: catColors[i] }} />
                {l} ({catValues[i]})
              </div>
            ))}
          </div>
          <div className="chart-inner" style={{ height: 240 }}>
            <Doughnut data={doughnutData} options={sharedOpts} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title">Category article count</div>
          <div className="chart-inner" style={{ height: 300 }}>
            <Bar
              data={barCatData}
              options={{
                ...sharedOpts,
                indexAxis: 'y',
                scales: {
                  x: { ticks: { font: { size: 11 } }, grid: { color: '#f0f0ef' } },
                  y: { ticks: { font: { size: 11 } } }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Row 2: Line chart full width */}
      <div className="charts-grid">
        <div className="chart-card full">
          <div className="chart-title">Articles published by date</div>
          <div className="chart-inner" style={{ height: 220 }}>
            <Line
              data={lineData}
              options={{
                ...sharedOpts,
                scales: {
                  x: { ticks: { font: { size: 11 } }, grid: { color: '#f0f0ef' } },
                  y: { ticks: { stepSize: 1, font: { size: 11 } }, grid: { color: '#f0f0ef' } }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Row 3: Top sources bar */}
      <div className="charts-grid">
        <div className="chart-card full">
          <div className="chart-title">Top news sources</div>
          <div className="chart-inner" style={{ height: 260 }}>
            <Bar
              data={barSrcData}
              options={{
                ...sharedOpts,
                indexAxis: 'y',
                scales: {
                  x: { ticks: { stepSize: 1, font: { size: 11 } }, grid: { color: '#f0f0ef' } },
                  y: { ticks: { font: { size: 11 } } }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
