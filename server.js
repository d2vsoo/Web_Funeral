// env 연결
require('dotenv').config()

// express library 사용
const express = require('express');
const connectDB = require('./database.js');
const app = express()

// 환경 변수 사용
const port = process.env.PORT;

// bcrypt 사용
const bcrypt = require('bcrypt')

connectDB.then((client)=>{
    console.log('db 연결 성공')
    db = client.db('EuljiFunernal')
}).catch((err)=>{
    console.log(err)
})

// user가 데이터를 보내면 요청.body 안에 넣어주는 기능
app.use(express.json())
app.use(express.urlencoded({extended:true}))

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

// 회원가입 유저 정보 입력하기
app.post('/signup', async(요청, 응답)=>{

    // 회원가입
    await db.collection('User').insertOne({
        userId : 요청.body.userid,
        password : 요청.body.password,
        username : 요청.body.name,
        birth : 요청.body.birth,
        month : 요청.body.month,
        day : 요청.body.day,
        num : 요청.body.num01 + '-' + 요청.body.num02 + '-' + 요청.body.num03,
        email : 요청.body.email01 + '@' + 요청.body.email02,
        EmployeeNum : 요청.body.enum
    });
    console.log("User 데이터 저장 완료")
    응답.redirect('/')
});

// 로그인 페이지 접속
app.use('/login', require('./routes/login.js'))