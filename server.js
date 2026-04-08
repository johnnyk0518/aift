const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(express.json());
app.use(express.static('public'));

// 1. 공부 기록 저장 API
app.post('/api/save-study', async (req, res) => {
  const { subject, duration } = req.body;
  try {
    await pool.query('INSERT INTO test (subject_name, duration_minutes) VALUES ($1, $2)', [subject, duration]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. 그래프용 데이터 가져오기 API (새로 추가됨)
app.get('/api/get-stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT subject_name, SUM(duration_minutes) as total_time 
      FROM test 
      GROUP BY subject_name
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
