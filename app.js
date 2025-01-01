// app.js
require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');

// Body parser
app.use(express.json());

// 라우트 연결
app.use('/api', authRoutes);

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
