const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();

// Neon DB 연결 설정 (나중에 Render 환경변수에서 가져옴)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(express.urlencoded({ extended: true }));

// 메인 화면
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 데이터 저장 API
app.post('/add', async (req, res) => {
  const { date, subject, hours } = req.body;
  try {
    await pool.query(
      'INSERT INTO study_logs (study_date, subject, hours) VALUES ($1, $2, $3)',
      [date, subject, hours]
    );
    res.send('<script>alert("저장 완료!"); location.href="/";</script>');
  } catch (err) {
    res.status(500).send("에러 발생: " + err.message);
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
