const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Neon 데이터베이스 연결 설정
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Neon 연결 시 필수 보안 설정
  }
});

app.use(express.json());
app.use(express.static('public')); // public 폴더 안의 html 파일을 보여줌

// 공부 기록 저장 API
app.post('/api/save-study', async (req, res) => {
  const { subject, duration } = req.body;

  try {
    const query = 'INSERT INTO test (subject_name, duration_minutes) VALUES ($1, $2) RETURNING *';
    const values = [subject, duration];
    const result = await pool.query(query, values);
    
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: '데이터 저장 실패' });
  }
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
