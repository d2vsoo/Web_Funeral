// setting 변수 생성
const router = require('express').Router();

// DB 연결
let connectDB = require('../database.js');
const { ObjectId } = require('mongodb');

let db
connectDB.then((client)=>{
    console.log('signup.js에서의 DB 연결 성공')
    db = client.db('EuljiFunernal')
}).catch((err)=>{
    console.log(err)
});

// app > router로 사용

// 회원가입 페이지 접속
router.get('/', (요청, 응답) => {
    응답.render('signup.ejs')
})

router.post('/', async(요청, 응답)=>{

    const userid = 요청.body.userid;
    const password = 요청.body.password;
    const password02 = 요청.body.password02;
    const name = 요청.body.name;
    const birth = 요청.body.birth;
    const month = 요청.body.month;
    const day = 요청.body.day;
    const num01 = 요청.body.num01;
    const num02 = 요청.body.num02;
    const num03 = 요청.body.num03;
    const email01 = 요청.body.email01;
    const email02 = 요청.body.email02;
    const empNum = 요청.body.enum;

    await db.collection('EuljiFunernal').insertOne({
        userid : userid,
        password : password,
        password02 : password02,
        name : name,
        birth : birth + '년' + month + '월' + day + '일',
        number : num01 + '-' + num02 + '-' + num03,
        email : email01 + '@' + email02,
        enum : empNum
    })
    응답.redirect('/')
})

// export
module.exports = router