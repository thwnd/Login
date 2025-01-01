// controllers/authController.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// 1) 회원가입 로직
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1-1) 이미 가입된 이메일인지 확인
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }

    // 1-2) 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1-3) DB에 사용자 추가
    //      필요한 필드를 자유롭게 추가(예: subscribe, subscribe_start_date 등)
    await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES (?, ?, ?)`,
      [name, email, hashedPassword]
    );

    return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 2) 로그인 로직
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 2-1) DB에서 사용자 찾기
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    const user = rows[0];

    // 2-2) 비밀번호 검증
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    // 2-3) JWT 생성
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
      }
    );

    // 2-4) 응답
    return res.status(200).json({
      message: '로그인 성공',
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 3) (예시) 인증 후 프로필 조회
exports.getProfile = async (req, res) => {
  // authMiddleware가 req.user에 id, email 등을 넣어줌.
  try {
    const [rows] = await pool.query(
      `SELECT id, email, name, subscribe, subscribe_start_date, subscribe_grade
       FROM users
       WHERE id = ?`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const user = rows[0];
    return res.status(200).json({
      message: '인증된 사용자만 접근 가능합니다.',
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
