const express = require('express');
const pool = require('./db');
const router = express.Router();

//save a run
router.post('/api/runs', async (req, res) => {
  const { run_date, distance_km, duration_seconds, notes  } = req.body;

if (
  !run_date ||
  !Number.isFinite(Number(distance_km)) ||
  Number(distance_km) <= 0 ||
  !Number.isInteger(Number(duration_seconds)) ||
  Number(duration_seconds) <=
}) {
  return res.status(400).json({
    error: 'Provide a date, positive distance, and positive time.'
  });
}

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
