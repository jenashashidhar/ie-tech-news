require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api', require('./routes/news'));

app.get('/', (req, res) => res.json({ message: 'IE Tech News API running' }));

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
