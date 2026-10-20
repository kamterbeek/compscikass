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
      'INSERT INTO public.runs (run_date, distance_km, duration_seconds, notes)
      VALUES ($1, $2, $3, $4) 
      RETURNING *',
        [run_date, distance_km, duration_seconds, notes || null]
      );

res.status(201).json(result.rows[0]);
    } catch (err) {
    console.error('Error saving run:', err.message);
    res.status(500).json({error: 'Database error'});
  }
});

//retieve newest runs newest first
router.get('/api/runs', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM public.runs ORDER BY run_date DESC, id DESC'
    );
    res.json(result.rows);
  } catch(err) {
    console.error('Error retrieving runs:', err.message);
    res.status(500).json({ error: 'Could not retrieve runs.'});
  }
});

module.exports = router;
