// initialise Express App
const express = require('express');
const { Pool } = require('pg');  // Fix: Pool should be imported from 'pg'
const bodyParser = require('body-parser');

// Set up PostgreSQL connection
const pool = new Pool({
    user: 'your_username',
    host: 'localhost',
    database: 'running_data',
    password: 'NewJob25!',
    port: 5432,
});

// Initialize Express app (Fix: 'application' should be 'app')
const app = express();

// Middleware for JSON parsing
app.use(bodyParser.json());  // Fix: Correctly use 'app' instead of 'application'

// Endpoint to handle form submission
app.get('/progress/:email', async (req, res) => {  // Fix: Corrected endpoint and added missing bracket
    const { email } = req.params;
    try {
        const result = await pool.query(
            'SELECT date, distance, time FROM running_sessions WHERE email = $1 ORDER BY date DESC',
            [email]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching progress data:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Start the server
const port = 3000;  // Make sure the port is defined
app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
});
