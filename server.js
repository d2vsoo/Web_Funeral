// env 연결
require('dotenv').config()
// 환경 변수 사용
const port = process.env.PORT;

// =====================================================================

// express library 사용
const express = require('express');
const app = express();

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

// 회원가입 페이지 접속
app.use('/signup', require('./routes/signup.js'))

// 회원가입하기
app.post('/signup', async (요청, 응답) => {
})

// 아이디 확인 POST
app.post('/checkId', async(요청, 응답)=>{
    const {userid} = 요청.body;

    // db에 userid가 있는지 확인하기
    const user = await db.collection('EuljiFuneral').findOne({userid : userid});

    if (user) {
        // user가 존재한다면 json 형식으로 false 응답 보내기
        return 응답.json({isAvailable : false});
    } else {
        return 응답.json({isAvailable : true});
    }
})

// 로그인 페이지 접속
app.use('/login', require('./routes/login.js'))
