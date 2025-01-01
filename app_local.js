// app_local.js
const express = require('express');
const app = express();
const localAuthRoutes = require('./routes/localAuthRoutes'); 
// 또는 기존 authRoutes를 가져오되, 내부에서 DB 대신 userStore 사용하도록 구현할 수도 있음.


console.log('Imported modules successfully.');

app.use(express.json());

console.log('Set up express.json middleware.');

// DB 없이 로컬 임시 저장소를 쓰는 라우트
app.use('/api', localAuthRoutes);

const PORT = 4000; // 겹치지 않는 임의의 포트
app.listen(PORT, () => {
  console.log(`(Local) Server started on http://localhost:${PORT}`);
});
