// env 연결
require('dotenv').config()
// 환경 변수 사용
const port = process.env.PORT;

// =====================================================================

// express library 사용
const express = require('express');
const app = express();

// passport setting
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')

// hashing
const bcrypt = require('bcrypt') 

// connect-Mongo 사용
const MongoStore = require('connect-mongo')

app.use(passport.initialize())
app.use(session({
    secret: process.env.COOKIE_SECRET,
    // 유저의 요청마다 session 갱신 여부
    resave : false,
    // 세션 저장 여부
    saveUninitialized : false,
    cookie : {maxAge : 1000 * 60 * 60},
    store : MongoStore.create({
        mongoUrl : process.env.DB_URL,
        dbName : 'EuljiFuneral'
    })
}))

app.use(passport.session())
// =====================================================================

// public 정적파일 지정
app.use(express.static('public'));

// database.js 파일 경로
const connectDB = require('./database.js');

// =====================================================================

// user가 데이터를 보내면 요청.body 안에 넣어주는 기능
// JSON 형식으로 된 본문 데이터를 파싱할 수 있도록 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================================

// DB 연결
let db
connectDB.then((client) => {
    console.log('server.js에서의 DB 연결 성공')
    db = client.db('EuljiFunernal')
    // 서버 띄우기
    app.listen(port, () => {
        console.log('지수의 장례식장 리뉴얼 웹페이지 서버 실행 중')
    })
}).catch((err) => {
    console.log(err)
})

// =====================================================================

// 메인페이지 접속 확인
app.get('/', (요청, 응답) => {
    응답.sendFile(__dirname + '/views/index.html')
})

// =====================================================================

// 회원가입 페이지 접속
app.use('/signup', require('./routes/signup.js'))

// 회원가입하기
app.post('/signup', async(요청, 응답)=>{

    const userid = 요청.body.userid;
    const password = 요청.body.password;
    const password02 = 요청.body.password02;
    const name = 요청.body.name;
    const year = 요청.body.year;
    const month = 요청.body.month;
    const day = 요청.body.day;
    const num01 = 요청.body.num01;
    const num02 = 요청.body.num02;
    const num03 = 요청.body.num03;
    const email01 = 요청.body.email01;
    const email02 = 요청.body.email02;
    const empNum = 요청.body.empNum;

    //hashing
    hash = await bcrypt.hash(password, 10)
    console.log(hash)

    await db.collection('User').insertOne({
        userid : userid,
        password : password,
        password02 : password02,
        name : name,
        birth : year + '년' + month + '월' + day + '일',
        number : num01 + '-' + num02 + '-' + num03,
        email : email01 + '@' + email02,
        empNum : empNum
    })
    응답.redirect('/')
})

// =====================================================================

// 로그인 페이지 접속
app.use('/login', require('./routes/login.js'))
