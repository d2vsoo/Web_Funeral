// setting 변수 생성
const router = require('express').Router();

// app > router로 사용

// 로그인 페이지 접속
router.get('/', (요청, 응답)=>{
    응답.render('login.ejs')
})

// export
module.exports = router