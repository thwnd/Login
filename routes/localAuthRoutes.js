// routes/localAuthRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { addUser, findUserByEmail } = require('../userStore');

// 회원가입 (DB 대신 userStore 사용)
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  const existing = findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
  }

  const hashed = await bcrypt.hash(password, 10);
  addUser({
    id: Date.now(), // 간단히 현재 타임스탬프 사용
    email,
    name,
    password: hashed,
  });

  res.status(201).json({ message: '회원가입 완료 (로컬)' });
});

// 로그인 (DB 대신 userStore 사용)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, 'LOCAL_SECRET_KEY', {
    expiresIn: '1h',
  });

  res.status(200).json({ message: '로그인 성공 (로컬)', token });
});

// (예시) 프로필
router.get('/profile', (req, res) => {
  // 로컬 테스트용이므로 토큰 검증 로직 생략 가능 or JWT 미들웨어 추가
  return res.json({ message: '로컬 환경 프로필', data: '...' });
});

module.exports = router;
