const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(express.json());
app.use(express.static('public'));

app.post('/save', async (req, res) => {
  const { subject, time } = req.body;
  await pool.query('INSERT INTO study_logs (subject_name, duration_minutes) VALUES ($1, $2)', [subject, time]);
  res.json({ ok: true });
});

app.listen(3000, () => console.log('서버 준비 완료!'));
