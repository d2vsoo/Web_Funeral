// setting 변수 생성
const router = require('express').Router();

// bcrypt 사용
const bcrypt = require('bcrypt') 

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

<<<<<<< HEAD
// =====================================================================

=======
>>>>>>> origin/main
// app > router로 사용

// 회원가입 페이지 접속
router.get('/', (요청, 응답) => {
    응답.render('signup.ejs')
})

<<<<<<< HEAD
// =====================================================================

=======
>>>>>>> origin/main
// 아이디 확인 POST
router.post('/checkId', async(요청, 응답)=>{
    const {userid} = 요청.body;

    // db에 userid가 있는지 확인하기
    const db_user = await db.collection('User').findOne({userid : userid});

    // user 변수가 존재하면 해당 아이디는 이미 사용 중이라는 의미
    if (db_user) {
        // userid는 사용불가
        return 응답.json({isAvailable : false});
    // 만약 db에 userid가 없으면
    } else {
        // userid는 사용 가능
        return 응답.json({isAvailable : true});
    }
})

<<<<<<< HEAD
// =====================================================================

=======
>>>>>>> origin/main
// 사원번호 확인 POST
router.post('/checkEmpNum', async(요청,응답)=>{
    const {empNum} = 요청.body;

    // db에 empNum이 있는지 확인하기
    const db_empNum = await db.collection('Employee').findOne({empNum : empNum});
    const UserEmpNum = await db.collection('User').findOne({empNum : empNum})

    // db_empNum 변수가 존재하면 
    // 해당 empNum은 데이터베이스에 저장되어 있음을 의미
    if (db_empNum){
        if(UserEmpNum){
            // 해당 empNum이 데이터베이스에 존재할 경우 응답
            return 응답.json({isnonExist : false})
        } else {
            return 응답.json({nonExist : false})
        }
    } else {
        // 해당 empNum이 데이터베이스에 존재하지 않을 경우 응답
        return 응답.json({nonExist : true})
    }
})

<<<<<<< HEAD
// =====================================================================

// 회원가입하기
router.post('/', async(요청, 응답)=>{

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
    return 응답.redirect('/');
})

// =====================================================================
=======
>>>>>>> origin/main

// export
module.exports = router