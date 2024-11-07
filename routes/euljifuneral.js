const router = require('express').Router();

// DB 연결
let connectDB = require('../database.js');
const { ObjectId } = require('mongodb');

let db
connectDB.then((client) => {
    console.log('euljifuneral.js에서의 DB 연결 성공')
    db = client.db('EuljiFunernal')
}).catch((err) => {
    console.log(err)
});

router.get('/introduce', (요청, 응답) => {
    응답.render('sub_introduce')
})

router.get('/director', async (요청, 응답) => {
    let result = await db.collection('Employee').find().toArray();
    let fdImg = await db.collection('fdImg').find().toArray();
    응답.render('sub_fd', { 직원정보: result, 직원이미지: fdImg })
})

router.get('/traffic', (요청, 응답) => {
    JAVASCRIPT_KEY = process.env.JAVASCRIPT_KEY;
    응답.render('sub_traffic')
})

router.get('/process', (요청, 응답) => {
    응답.render('sub_process')
})

router.get('/service', (요청, 응답) => {
    응답.render('sub_service')
})

router.get('/info', (요청, 응답) => {
    응답.render('sub_info')
})

router.get('/status', async (요청, 응답) => {

    statusDBdata = await db.collection('Status').find().toArray();

    응답.render('sub_status', { 빈소현황: statusDBdata })
})

router.get('/condolences/list/:list', async(요청, 응답) => {

    const page = parseInt(요청.params.list);

    const totalcontents = await db.collection('condoBoard').countDocuments();
    
    // 전체 페이지수는 전체 게시글 수를 12(한 페이지당 나타나는 게시글 수)로 나눈 값
    const totalPages = Math.ceil(totalcontents/12);

    let result = await db.collection('condoBoard').find().skip((요청.params.list-1)*12).limit(12).toArray();

    응답.render('sub_condo', {조문게시판 : result, 현재페이지:page, 전체페이지:totalPages})
})

// 조문 게시판
router.get('/condolences/write', async (요청, 응답) => {

    // 빈소 현황 불러오기
    const status = await db.collection('Status').find().toArray();
    // 빈소 비밀번호 불러오기
    const password = await db.collection('condo_Password').find().toArray();

    응답.render('sub_condowrite', { 빈소현황: status, 비밀번호: password })
})

// 조문 글 작성 post >> db에 저장하기
router.post('/condolences/write', async (요청, 응답) => {

    const roomNum =  요청.body.room;
    const deceasedName = 요청.body.deceasedName;
    const writer = 요청.body.writename;
    const relation = 요청.body.relation;
    const title = 요청.body.writetitle;
    
    const date = new Date();
    const currentDate = {
        year : date.getFullYear(),
        month : date.getMonth() + 1 ,
        day : date.getDate()
    }
    const dateValue = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

    const content = 요청.body.writecontent;
    const password = 요청.body.writepassword;

    console.log(roomNum, deceasedName, writer, relation, title, date, content, password);

    await db.collection('condoBoard').insertOne({
        roomNum: roomNum,
        deceasedName: deceasedName,
        writer: writer,
        relation: relation,
        title: title,
        date: dateValue,
        content: content,
        password: password
    });
    응답.redirect('/euljifuneral/condolences/list/1');
});

// 게시글 삭제 post
router.post('/condolences/delete', async(요청, 응답)=>{
    boardDBdata = await db.collection('condoBoard').find().toArray();
    console.log(boardDBdata);

    const roomNum = boardDBdata[0].roomNum;
    const writer = boardDBdata[0].writer;
    const deletebtn = 요청.body.delete;

    console.log(roomNum)
    console.log(writer)
    console.log(deletebtn)

    // 삭제버튼을 누르면
    if(deletebtn === 'delete'){
        // 빈소현황에 있는 같은 데이터를 삭제해줘
        await db.collection('condoBoard').deleteOne({
            roomNum : roomNum,
            writer : writer
        })
    }
    return 응답.redirect('/euljifuneral/condolences/list/1')
})

router.get('/thanks', (요청, 응답) => {
    응답.render('sub_thanks')
})

module.exports = router;