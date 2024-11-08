const router = require('express').Router();

const { render } = require('ejs');

const methodOverride = require('method-override');

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

//========================================================================

// 장례식장 소개
router.get('/introduce', (요청, 응답) => {
    응답.render('sub_introduce')
})

//========================================================================

// 장례지도사 소개
router.get('/director', async (요청, 응답) => {
    let result = await db.collection('Employee').find().toArray();
    let fdImg = await db.collection('fdImg').find().toArray();
    응답.render('sub_fd', { 직원정보: result, 직원이미지: fdImg })
})

//========================================================================

// 오시는 길
router.get('/traffic', (요청, 응답) => {
    JAVASCRIPT_KEY = process.env.JAVASCRIPT_KEY;
    응답.render('sub_traffic')
})

//========================================================================

// 장례절차
router.get('/process', (요청, 응답) => {
    응답.render('sub_process')
})

//========================================================================

// 장례서비스
router.get('/service', (요청, 응답) => {
    응답.render('sub_service')
})

//========================================================================

// 장례식장 이용안내
router.get('/info', (요청, 응답) => {
    응답.render('sub_info')
})

//========================================================================

// 빈소 현황 
router.get('/status', async (요청, 응답) => {

    statusDBdata = await db.collection('Status').find().toArray();

    응답.render('sub_status', { 빈소현황: statusDBdata })
})

//========================================================================

// 조문 게시판
router.get('/condolences/list/:list', async (요청, 응답) => {

    const page = parseInt(요청.params.list);

    const totalcontents = await db.collection('condoBoard').countDocuments();

    // 전체 페이지수는 전체 게시글 수를 12(한 페이지당 나타나는 게시글 수)로 나눈 값
    const totalPages = Math.ceil(totalcontents / 12);

    let result = await db.collection('condoBoard').find().skip((요청.params.list - 1) * 12).limit(12).toArray();

    응답.render('sub_condo', { 조문게시판: result, 현재페이지: page, 전체페이지: totalPages })
})

//========================================================================

router.get('/condolences/write', async (요청, 응답) => {

    // 빈소 현황 불러오기
    const status = await db.collection('Status').find().toArray();
    // 빈소 비밀번호 불러오기
    const password = await db.collection('condo_Password').find().toArray();

    응답.render('sub_condowrite', { 빈소현황: status, 비밀번호: password })
})

//========================================================================


// 조문 글 작성 post >> db에 저장하기
router.post('/condolences/write', async (요청, 응답) => {

    const roomNum = 요청.body.room;
    const deceasedName = 요청.body.deceasedName;
    const writer = 요청.body.writename;
    const relation = 요청.body.relation;
    const title = 요청.body.writetitle;

    const date = new Date();
    const currentDate = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
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

//========================================================================

// 조문 게시판 상세페이지 
router.get('/condolences/detail/:id', async (요청, 응답) => {

    요청.params

    try {
        let result = await db.collection('condoBoard').findOne({
            _id: new ObjectId(요청.params.id)
        })
        console.log(result)
        if (result === null) {
            응답.send("<script> alert('해당 글을 찾을 수 없습니다.'); </script>")
        } else {
            응답.render('sub_condodetail', { 상세페이지: result })
        }
    } catch (e) {
        console.log(e);
        응답.status(404).send("상세페이지의 주소가 잘못되었습니다.");
    }
})

//========================================================================

// 게시글 삭제 post >> 비밀번호 확인 후 삭제하기
router.post('/condolences/delete', async (요청, 응답) => {
    boardDBdata = await db.collection('condoBoard').find().toArray();
    console.log(boardDBdata);

    const roomNum = boardDBdata[0].roomNum;
    const writer = boardDBdata[0].writer;
    const deletebtn = 요청.body.delete;
    const password = 요청.body.password;

    console.log(roomNum)
    console.log(writer)
    console.log(deletebtn)
    console.log(password)

    // 삭제버튼을 누르면
    if (deletebtn === 'delete') {

        if (password === boardDBdata[0].password) {
            await db.collection('condoBoard').deleteOne({
                roomNum: roomNum,
                writer: writer,
                password: password
            });
            return 응답.send("비밀번호가 일치합니다. 게시글을 삭제합니다.")
        } else {
            return 응답.send("비밀번호가 일치하지 않습니다.")
        }

    }
})

//========================================================================

// 조문게시판 수정페이지
router.get('/condolences/edit/:id', async (요청, 응답) => {

    요청.params;

    let result = await db.collection('condoBoard').findOne({ _id: new ObjectId(요청.params.id) });
    console.log(result);

    // 빈소 비밀번호 불러오기
    const password = await db.collection('condo_Password').find().toArray();

    응답.render('sub_condoedit', { 수정페이지: result, 비밀번호: password });

})

router.put('/condolences/edit', async (요청, 응답) => {

    console.log("form수정내용 : ", 요청.body)
    console.log("form수정내용 : ", 요청.body.id)
    console.log("form수정내용 : ", 요청.body.editname)
    console.log("form수정내용 : ", 요청.body.relation)
    console.log("form수정내용 : ", 요청.body.editcontent)
    console.log("form수정내용 : ", 요청.body.editpassword)

    const editContent = await db.collection('condoBoard').updateOne(
        { _id: new ObjectId(요청.body.id) },
        {
            $set: {
                writer: 요청.body.editname,
                relation: 요청.body.relation,
                title: 요청.body.edittitle,
                content: 요청.body.editcontent,
                password: 요청.body.editpassword
            }
        })
    console.log(editContent);
    응답.redirect('/euljifuneral/condolences/list/1');
})

//========================================================================

// 감사인사 페이지
router.get('/thanks', (요청, 응답) => {
    응답.render('sub_thanks')
})

module.exports = router;