// MongoDB 연결 Setting Code
const {MongoClient} = require('mongodb');

let db
const url = 'mongodb+srv://d2vsoo:Wltn9966love@d2vsoo.irgum.mongodb.net/?retryWrites=true&w=majority&appName=d2vsoo';

new MongoClient(url).connect().then((client)=>{
    console.log('db 연결 성공')
    db = client.db('EuljiFunernal')

    // 서버 띄우기
    app.listen(8080, ()=>{
        console.log('http://localhost:8080에서 서버 실행 중')
        console.log(__dirname)
    });
}).catch((err)=>{
    console.log(err)
})

// express library 사용
const express = require('express')
const app = express()


// 메인페이지 접속 확인
app.get('/', (요청, 응답) => {
    응답.sendFile(__dirname + '/views/index.html')
})