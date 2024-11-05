// env 연결
require('dotenv').config()
// 환경 변수 사용
const port = process.env.PORT;

// =====================================================================

// express library 사용
const express = require('express');
const app = express();

// =====================================================================

// ejs 설정
app.set('view engine', 'ejs');

const path = require('path');

app.set('views', path.join(__dirname, 'views'));
console.log(path.join(__dirname, 'views'))

// public 정적파일 지정
app.use(express.static('public'));

// =====================================================================

// s3 라이브러리 setting
const {S3Client} = require('@aws-sdk/client-s3')
const multer = require('multer')
const multerS3 = require('multer-s3')
const s3 = new S3Client({
    region : process.env.REGION,
    credentials : {
        accessKeyId : process.env.ACCESS_KEY_ID,
        secretAccessKey : process.env.SECRET_ACCESS_KEY
    }
})

// 이미지 업로드 구현을 위해 필요한 모듈 multer 설정
const upload = multer({
    storage : multerS3({
        s3 : s3,
        bucket : process.env.BUCKET_NAME,
        key : function(요청, file, cb){
            cb(null, Date.now().toString());
        }
    })
});

// 이미지 파일 저장 위치 및 이름 설정
const storage = multer.diskStorage({
    // 업로드할 이미지 파일 저장 경로 (목적지)
    destination : (요청, file, cb)=>{
        // fdImg : 폴더명
        cb(null, path.join(__dirname, 'public'));
    },
    filename : (요청, file, cb) =>{
        cb(null, Date.now().toString());
    }
});

module.exports = { upload };
// =====================================================================

// passport setting
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')

// hashing
const bcrypt = require('bcrypt') 

// =====================================================================

// connect-Mongo 사용
const MongoStore = require('connect-mongo')

// =====================================================================

app.use(passport.initialize())
app.use(session({
    secret: process.env.COOKIE_SECRET,
    // 유저의 요청마다 session 갱신 여부
    resave : false,
    // 세션 저장 여부
    saveUninitialized : false,
    cookie : {maxAge : 60 * 60 * 1000},
    store : MongoStore.create({
        mongoUrl : process.env.DB_URL,
        dbName: 'EuljiFunernal',
        collectionName: 'sessions'
    })
}))

app.use(passport.session())

// =====================================================================

// database.js 파일 경로
const connectDB = require('./database.js');
const { ObjectId } = require('mongodb');
const { render } = require('ejs');

// =====================================================================

// DB 연결
let db
connectDB.then((client) => {
    console.log('server.js에서의 DB 연결 성공')
    db = client.db('EuljiFunernal')
    // 서버 띄우기
    app.listen(port, () => {
        console.log('http://localhost:8080에서 서버 실행 중');
    })
}).catch((err) => {
    console.log(err)
})

// =====================================================================

// user가 데이터를 보내면 요청.body 안에 넣어주는 기능
// JSON 형식으로 된 본문 데이터를 파싱할 수 있도록 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================================

// 메인페이지 접속 확인
app.get('/', async(요청, 응답) => {

    const statusDBdata = await db.collection('Status').find().toArray();

    응답.render('index', {빈소현황 : statusDBdata})
})

// 서브페이지 접속 확인
app.use('/euljifuneral', require('./routes/euljifuneral.js'));

// =====================================================================

// 회원가입 라우팅
app.use('/signup', require('./routes/signup.js'));

// 로그인 라우팅
app.use('/login', require('./routes/login.js'));

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

// 로그인 후에만 접속 가능한 페이지 라우팅
app.get('/management', loginOk, async(요청, 응답)=>{

    // 접속 유저 데이터
    let User = await db.collection('User').find().toArray();
    // 빈소 현황 데이터
    let status = await db.collection('Status').find().toArray();

    응답.render('management', {접속직원 : User, 빈소현황 : status});
});

function loginOk(요청, 응답, next){
    // 로그인 후 session에 있으면 요청.user가 항상 있는 것
    if(요청.user){
        next();
    } else {
        요청.send('로그인이 필요합니다.')
    }
}

// management - 빈소등록하기
app.post('/management', async (요청, 응답) => {

    const room = 요청.body.room;
    const deceased = 요청.body.deceased;

    let mourner = 요청.body.mourner;
    const nonmourner = 요청.body.nonmourner;

    console.log(mourner)

    let funeralDate = 요청.body.funeralDate;
    const nondate = 요청.body.nondate;

    let funeralTime = 요청.body.funeralTime;
    const nontime = 요청.body.nontime;

    let funeralPlace = 요청.body.funeralPlace;
    const nonplace = 요청.body.nonplace;

    const schedule = 요청.body.schedule;

    if (nonmourner) {
        mourner = '상주 미정';
    } 
    
    if (nondate) {
        funeralDate = '날짜 미정';
    }

    if (nontime) {
        funeralTime = '시간 미정';
    }

    if (nonplace) {
        funeralPlace = '장지 미정';
    }

    await db.collection('Status').insertOne({
        room: room,
        deceasedName : "故" + " " + deceased,
        mournerName : mourner,
        funeralDate : funeralDate,
        funeralTime : funeralTime,
        funeralPlace : funeralPlace,
        schedule : schedule + "장"
    });
    return 응답.redirect('management');
})

// 삭제 버튼 누르면 빈소현황 데이터 삭제하기
app.post('/management/delete', async(요청, 응답)=>{
    
    statusDBdata = await db.collection('Status').find().toArray();
    console.log(statusDBdata);

    const room = statusDBdata[0].room;
    const deceased = statusDBdata[0].deceasedName;
    const deletebtn = 요청.body.delete;

    console.log(room)
    console.log(deceased)
    console.log(deletebtn)

    // 삭제버튼을 누르면
    if(deletebtn === 'delete'){
        // 빈소현황에 있는 같은 데이터를 삭제해줘
        await db.collection('Status').deleteOne({
            room : room,
            deceasedName : deceased
        })
    }
    return 응답.redirect('/management')
})