# My Project

이 프로젝트는 회원가입, 로그인, JWT 인증을 제공하는 Node.js 서버입니다. 
DB가 준비된 환경/미준비 환경 모두 테스트할 수 있습니다.

---

## 1. DB 있는 환경에서 사용

1. `.env` 파일을 준비 (DB_HOST, DB_USER, DB_PASS, DB_NAME, JWT_SECRET 등)
2. `npm install`
3. `node app.js`
4. `http://localhost:3000/api/register` 등으로 테스트

---

## 2. DB 없이 로컬 테스트

DB 구축 전이거나, 간단히 기능만 확인하고 싶다면 아래 방법을 사용하세요.

1. `npm install`
2. `node app_local.js` (기본 포트: 4000)
3. 회원가입: `POST http://localhost:4000/api/register`
   ```json
   {
     "email": "test@example.com",
     "password": "1234",
     "name": "Tester"
   }
