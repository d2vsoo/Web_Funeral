// setting 변수 생성
const router = require('express').Router();

// passport setting
const passport = require('passport');
const LocalStrategy = require('passport-local');

// hashing
const bcrypt = require('bcrypt');

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

router.post('/', async(요청, 응답, next)=> {
    
    // user 인증 처리
    passport.authenticate('local', (error, user, info)=>{

        // 오류 발생 시 실행

        // 500 : 서버에서 문제가 발생하였으나 구체적인 내용 표시 불가 시
        if (error) 
            return 응답.status(500).json(error)

        // 아이디/ 비번 검증 완료된 유저 정보
        // 유효한 인증 정보가 부족하여 요청이 거부된 경우
        if (!user) 
            return 응답.status(401).json(info.message)

        // 아이디/비번 검증 실패 시 오류 메시지
        요청.logIn(user, (err)=>{
            if (err) return next(err)
            응답.redirect('/')
        })
    }) (요청, 응답, next)
})

// export
module.exports = router