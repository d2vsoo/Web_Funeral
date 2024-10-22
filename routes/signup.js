// setting 변수 생성
const router = require('express').Router();

// app > router로 사용

// 회원가입 페이지 접속
router.get('/', (요청, 응답) => {
    응답.render('signup.ejs')
})

router.post('/signup', async(요청, 응답)=>{
    
})

// export
module.exports = router