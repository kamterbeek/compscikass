const express = require('express');
const pool = require('./db');
const router = express.Router();

router.post('/submit', async (req, res) => {
  const { email, distance, time, date } = req.body;
  try {
    const result = await pool.query{
      'INSERT INTO running_sessions (email, distance, time, date) VALUES ($1, $2, $3, $4) RETURNING *',
        [email, distance, time, date]
      );
res.status(201).json(result.rows[0]);
    } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Database error'});
  }
});

module.exports = router;
