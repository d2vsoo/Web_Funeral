// express 라이브러리 사용하기
const express = require('express')
const app = express()

// =================================================================

// 서버 띄우기
app.listen(8080, ()=>{
    console.log("http://localhost:8080에서 서버 실행 중")
})

// =================== DB 연동하기 - MySQL ==========================
// MySQL 모듈 불러오기
const mysql = require('mysql');

const cnn = mysql.createConnection({
	// 서버일 경우 ip 주소
	host: 'localhost',
	user: 'root',
    password: 'personal_soo01',
    database: 'TAGPlace'
});

// cnn.connect();

// =================================================================

// 메인 페이지 접속하기
app.get('/', (req, res) => {
    res.send("메인페이지 접속 완료")
})
