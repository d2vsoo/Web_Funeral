// setting 변수 생성
const router = require('express').Router();

// DB 연결
let connectDB = require('../database.js');
const { ObjectId } = require('mongodb');

let db
connectDB.then((client)=>{
    console.log('login.js에서의 DB 연결 성공')
    db = client.db('EuljiFunernal')
}).catch((err)=>{
    console.log(err)
});

// app > router로 사용

// 로그인 페이지 접속
router.get('/', (요청, 응답)=>{
    응답.render('login.ejs')
})

// export
module.exports = router