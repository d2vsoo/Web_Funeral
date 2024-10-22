// env 연결
require('dotenv').config()

// express library 사용
const express = require('express');
const connectDB = require('./database.js');
const app = express()

// 환경 변수 사용
const port = process.env.PORT;

connectDB.then((client)=>{
    console.log('db 연결 성공')
    db = client.db('EuljiFunernal')
}).catch((err)=>{
    console.log(err)
})

// 서버 띄우기
app.listen(port, ()=>{
    console.log('http://localhost:8080에서 서버 실행 중')
});

// public 정적파일 지정
app.use(express.static('public'));

// 메인페이지 접속 확인
app.get('/', (요청, 응답) => {
    응답.sendFile(__dirname + '/views/index.html')
})

// 회원가입 페이지 접속
app.use('/signup', require('./routes/signup.js'))

// 로그인 페이지 접속
app.use('/login', require('./routes/login.js'))