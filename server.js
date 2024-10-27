// env 연결
require('dotenv').config()
// 환경 변수 사용
const port = process.env.PORT;

// =====================================================================

// express library 사용
const express = require('express');
const app = express();

const path = require('path');

// ejs 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
console.log(path.join(__dirname, 'views'))

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
        dbName : 'EuljiFuneral_LogInOut'
    })
}))

app.use(passport.session())

// =====================================================================

// public 정적파일 지정
app.use(express.static('public'));

// database.js 파일 경로
const connectDB = require('./database.js');
const { ObjectId } = require('mongodb');

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
    응답.render('index')
})

// =====================================================================

// 회원가입 페이지 접속
app.use('/signup', require('./routes/signup.js'));
// 로그인 라우팅
app.use('/login', require('./routes/login.js'));

// 회원가입하기
app.post('/signup', async(요청, 응답)=>{

    const userid = 요청.body.userid;
    const password = 요청.body.password;
    const username = 요청.body.username;
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
        password : hash,
        name : username,
        birth : year + '년' + month + '월' + day + '일',
        number : num01 + '-' + num02 + '-' + num03,
        email : email01 + '@' + email02,
        empNum : empNum
    })
    응답.redirect('/')
})

// =====================================================================

// 아이디/비번이 DB와 일치하는지 검증하는 로직 작성
passport.use(new LocalStrategy({

    usernameField : 'userid',

}, async(userid, pw, cb)=>{
        
    let result = await db.collection('User').findOne({userid : userid})

    if(!result){
        // 회원 인증 실패 시 false
        return cb(null, false, {message : "가입되지 않은 아이디입니다."})
        
    }

    // 비밀번호 비교 로그 추가
    console.log("입력 비밀번호:", pw);
    console.log("DB에 저장된 해시 비밀번호:", result.password);

    // 해싱된 비밀번호와 입력 비밀번호 비교하기
    if (await bcrypt.compare(pw, result.password)) {
        return cb(null, result)
    } else {
        return cb(null, false, {message : '비밀번호가 일치하지 않습니다.'})
    }
}))

// 로그인 세션 생성
// 로그인 성공 시 자동 세션 생성 및 유저 브라우저에 쿠키 저장하기
passport.serializeUser((user,done)=>{
    process.nextTick(()=>{
        done(null, {id : user._id, userid : user.userid})
    })
})

// 유저가 쿠키 제출한 내용을 확인해보기
passport.deserializeUser(async (user, done)=>{
    // user 파라미터 출력해서 유저 id 출력되면 db 조회 후 요청.user 안에 넣기
    let result = await db.collection('User').findOne({_id : new ObjectId(user.id)})

    // password는 필요 없으니까 지워주기
    // result가 유효할 때만 delete를 수행하도록 하기
    if (result && result.password) {
        delete result.password;
    }

    // 비동기적 처리 문법 사용
    process.nextTick(()=>{
        return done(null, result)
        //result가 요청.user안으로 들어가도록 함
    })
})

// =====================================================================

