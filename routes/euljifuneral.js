const router = require('express').Router();

// DB 연결
let connectDB = require('../database.js');
const { ObjectId } = require('mongodb');

let db
connectDB.then((client)=>{
    console.log('euljifuneral.js에서의 DB 연결 성공')
    db = client.db('EuljiFunernal')
}).catch((err)=>{
    console.log(err)
});

router.get('/introduce', (요청, 응답)=>{
    응답.render('sub_introduce')
})

router.get('/director', async(요청, 응답)=>{
    let result = await db.collection('Employee').find().toArray();
    let fdImg = await db.collection('fdImg').find().toArray();
    응답.render('sub_fd', { 직원정보 : result, 직원이미지 : fdImg})
})

router.get('/traffic', (요청, 응답)=>{
    JAVASCRIPT_KEY = process.env.JAVASCRIPT_KEY;
    응답.render('sub_traffic')
})

router.get('/process', (요청, 응답)=>{
    응답.render('sub_process')
})

router.get('/service', (요청, 응답)=>{
    응답.render('sub_service')
})

router.get('/status', (요청, 응답)=>{
    응답.render('sub_status')
})

router.get('/info', (요청, 응답)=>{
    응답.render('sub_info')
})

module.exports = router;