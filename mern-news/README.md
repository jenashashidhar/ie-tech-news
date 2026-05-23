# IE Tech News — MERN Stack

Live technology news dashboard powered by **newsdata.io**, built with MongoDB-ready Express + React.

---

## 📁 Project Structure

```
mern-news/
├── server/                  ← Express backend
│   ├── server.js            ← Entry point
│   ├── .env                 ← API keys
│   ├── package.json
│   └── routes/
│       └── news.js          ← All /api/* routes
│
├── client/                  ← React frontend
│   ├── public/index.html
│   ├── package.json
│   └── src/
│       ├── App.jsx           ← Router setup
│       ├── index.js
│       ├── index.css         ← All styles
│       ├── NewsContext.jsx   ← Global state (React Context)
│       ├── utils.js          ← Shared helpers
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── NewsCard.jsx
│       └── pages/
│           ├── NewsFeedPage.jsx   ← / (home)
│           ├── AnalyticsPage.jsx  ← /analytics
│           ├── TrendsPage.jsx     ← /trends
│           └── ArticlePage.jsx    ← /article/:id
│
└── package.json             ← Root: runs both together
```

---

## 🚀 Setup & Run

### Step 1 — Install dependencies

```bash
# From the mern-news/ root folder
npm install
npm run install-all
```

### Step 2 — Run both server and client

```bash
npm run dev
```

This starts:
- **Backend** → http://localhost:5000
- **Frontend** → http://localhost:3000

---

## 🔄 How Refresh Works

- Every time you open the app or click **Refresh**, the server calls newsdata.io with `refresh=true`, bypasses cache, and returns **brand new articles**.
- The server cache is only used for pagination (Load More) within the same session.
- Each refresh pulls the latest technology news.

---

## 🗺 Pages

| Route            | Description                                      |
|------------------|--------------------------------------------------|
| `/`              | News feed with search + category filters         |
| `/analytics`     | Charts: doughnut, bar, line, sources — on its own page |
| `/trends`        | Visual trend bars for categories, sources, dates |
| `/article/:id`   | Full article + AI summary + keyword frequency chart |

---

## ⚙️ Environment Variables

`server/.env`:
```
PORT=5000
NEWS_API_KEY=pub_1a599175de144f208e23f5e70cae92b3
```

---

## 📦 Tech Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Frontend | React 18, React Router v6, Chart.js, react-chartjs-2 |
| Backend  | Node.js, Express, Axios       |
| API      | newsdata.io (technology category) |
| Styling  | Plain CSS (Inter font)        |
