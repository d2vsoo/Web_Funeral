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

    passport.use(new LocalStrategy({

        usernameField : 'userid',
    
    }, async(userid, password, cb)=>{
            
        let result = await db.collection('User').findOne({userid : userid})
        console.log(result.password)
    
        if(!result){
            // 회원 인증 실패 시 false
            return cb(null, false, {message : "가입되지 않은 아이디입니다."})
        }
        if (await bcrypt.compare(password, result.password)) {
            return cb(null, result)
        } else {
            return cb(null, false, {message : '비밀번호가 일치하지 않습니다.'})
        }
    }))
    
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


// export
module.exports = router