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
<<<<<<< HEAD
connectDB.then((client) => {
    console.log('login.js에서의 DB 연결 성공')
    db = client.db('EuljiFunernal')
}).catch((err) => {
    console.log(err)
});

// =====================================================================

// app > router로 사용

// 로그인 페이지 접속
router.get('/', (요청, 응답) => {
    응답.render('login.ejs')
})

// =====================================================================

// 로그인 인증 확인하기
router.post('/', async (요청, 응답, next) => {

    // user 인증 처리
    passport.authenticate('local', (error, user, info) => {

        // 오류 발생 시 실행

        // 500 : 서버에서 문제가 발생하였으나 구체적인 내용 표시 불가 시
        if (error)
            return 응답.status(500).json(error)

        // 아이디/비번 검증 실패 시 오류 메시지
        // 아이디/ 비번 검증 완료된 유저 정보
        // 유효한 인증 정보가 부족하여 요청이 거부된 경우
        if (!user)
            return 응답.status(401).json(info.message)

        // 인증 성공 후 요청 객체에 로그인 세션 설정
        요청.logIn(user, (err) => {
            console.log(user)

            if (err) return next(err)
            console.log(user)

            응답.redirect('/')
        })
    })(요청, 응답, next)
})

// =====================================================================

// 로그인/로그아웃 버튼 구현을 위한 POST
router.post('/CheckLogInOut', async (요청, 응답) => {

    if (!요청.user || !요청.user._id) {
        return 응답.status(401).json({ error: '로그인 하지 않은 상태입니다.' });
    }

    const userId = 요청.user._id;
    console.log("userId : " + userId)

    const userSession = await db.collection('sessions').find().toArray();
    console.log('userSession:', userSession);

    let dbUserIdExist = false;

    userSession.forEach(userSession => {
        // forEach 내에서만 사용 가능
        const sessionData = JSON.parse(userSession.session);
        const dbUserId = sessionData.passport.user.id;

        console.log(dbUserId);

        // dbUserId가 로그인 _id와 일치하는지 확인하기
        if (dbUserId === userId) {
            dbUserIdExist = true;
            console.log(dbUserIdExist)
        }
    })

    if(dbUserIdExist) {
        return 응답.json({exist : true})
    } else {
        return 응답.json({exist : false})
    }
});

// =====================================================================

=======
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
        if (error) return 응답.status(500).json(error)
        // 아이디/ 비번 검증 완료된 유저 정보
        if (!user) return 응답.status(401).json(info.message)
        // 아이디/비번 검증 실패 시 오류 메시지
        요청.logIn(user, (err)=>{
            if (err) return next(err)
            응답.redirect('/')
        })
    }) (요청, 응답, next)

})

>>>>>>> origin/main
// export
module.exports = router