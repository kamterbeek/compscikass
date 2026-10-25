const express = require('express');
const path = require('path');
require('dotenv').config();

const routes = require('./routes');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(routes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
