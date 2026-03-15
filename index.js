const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Render에서 설정한 DATABASE_URL 환경변수를 사용합니다.
// Neon은 SSL 연결이 필수이므로 ssl 설정을 추가합니다.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/', async (req, res) => {
  try {
    // test 테이블에서 name 하나만 조회하는 쿼리
    const result = await pool.query('SELECT name FROM test LIMIT 1');
    
    if (result.rows.length > 0) {
      const name = result.rows[0].name;
      res.send(`HELLO ${name}`);
    } else {
      res.send('데이터가 없습니다.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('서버 에러가 발생했습니다.');
  }
});

app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});