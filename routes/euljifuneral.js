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
    응답.render('sub_funeraldirector', { 직원정보 : result})
})

module.exports = router;