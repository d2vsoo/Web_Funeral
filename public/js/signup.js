// 아이디 확인 버튼 클릭
document.querySelector('#idCheck').addEventListener('click', function(){

    const userid = document.querySelector('#userid').value;

    const korean = /^[ㄱ-ㅎ가-힣]+$/;
    const Text = /^[a-zA-Z0-9]+$/;

    // server.js로 아이디 확인 요청 보내기
    fetch('/signup/checkId', {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            userid : document.querySelector('input[name="userid"]').value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.isAvailable) {
            if (userid.length < 4 || userid.length > 12) {
                alert ("아이디는 총 길이 4~12자로 입력해주세요.")
            } else if (korean.test(userid) || !Text.test(userid)) {
                alert ("영문자와 숫자만 입력 가능합니다.")
            } else {
                alert('사용 가능한 아이디입니다.')
            }
            
        } else {
            alert("이미 사용 중인 아이디입니다.")
        }
    })
    .catch(error => {
        console.error('Error', error);
    })
})

// =======================================================================

// 비밀번호 확인
document.querySelector('#pwCheck').addEventListener('click', function(){

    // 비밀번호 조건
    // 8글자 이상 16글자 이하
    // 대문자 최소 하나 이상
    // 소문자 최소 하나 이상
    // 숫자 최소 하나 이상
    // 특수문자 포함 !;-@#$%^&*

    const password = document.querySelector('#password').value;
    const password02 = document.querySelector('#password02').value;

    // ^ : 문자열 시작
    // $ : 문자열 끝

    // (?=) 긍정형 전방 탐색 - 특정 패턴 존재 > 매칭 문자열에서는 제외
    // .* 임의의 문자 0개 이상
    const pwText = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,16}$/;

    if (!pwText.test(password)) {
        alert(" 1. 8글자 이상 16글자 이하 \n 2. 영문 대소문자와 숫자, 특수문자를 모두 하나 이상 사용 \n 3. 특수문자 !;-@#$%^&* 사용 가능")
    } else if (password !== password02) {
        alert ("비밀번호를 다시 확인해주세요.")
    } else {
        alert("사용 가능한 비밀번호입니다.")
    }
})

// =======================================================================

// 사원번호 확인
document.querySelector('#empNumCheck').addEventListener('click', function(){

    const empNumValue = document.querySelector('input[name="empNum"]').value;
    const numText = /^[0-9]+$/;

    if (!empNumValue) {
        alert("사원번호를 입력해주세요.");
        return;
    } else if(!numText.test(empNumValue)){
        alert('숫자만 입력 가능합니다.');
        return;
    } 
    
    fetch('/signup/checkEmpNum', {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            empNum : empNumValue
        })
    })
    // fetch 요청 후 받은 응답 처리 로직
    .then(response => response.json())
    .then(data => {
        if (data.nonExist){
            alert("사원번호 확인 불가. 다시 입력하시기 바랍니다.")
        } else {
            if(data.isnonExist === false){
                alert('이미 가입된 사원번호입니다.')
            } else {
                alert('사원번호가 확인되었습니다.')
            }
        }
    })
    .catch(error=>{
        console.error('Error', error);
    })
})

// =======================================================================

// 아이디, 비밀번호, 사원번호 확인 버튼을 누르지 않았으면
// 폼 제출 방지하기
let isIdChecked = false;
let isPwChecked = false;
let isEmpNumChecked = false;

// 확인 버튼 누르면 true로 바꾸기
document.querySelector('#idCheck').addEventListener('click', function(){
    isIdChecked = true;
})

document.querySelector('#pwCheck').addEventListener('click', function(){
    isPwChecked = true;
})

document.querySelector('#empNumCheck').addEventListener('click', function(){
    isEmpNumChecked = true;
})

// 폼 제출 버튼을 눌렀을 때, 확인 버튼이 false일 경우 폼 제출 방지하기
document.querySelector('#userForm').addEventListener('submit', function(e){
    const year = document.querySelector('#year').value;
    const month = document.querySelector('#month').value;
    const day = document.querySelector('#day').value;

    const num01 = document.querySelector('#num01').value;
    const num02 = document.querySelector('#num02').value;
    const num03 = document.querySelector('#num03').value;
    
    if (isIdChecked !== true || isPwChecked !== true || isEmpNumChecked !== true){
        e.preventDefault();
        if (isIdChecked !== true){
            alert("아이디 확인 버튼을 눌러주세요.");
            return;
        } 
        if (isPwChecked !== true){
            alert("비밀번호 확인 버튼을 눌러주세요.");
            return;
        } 
        if (isEmpNumChecked = true){
            alert("사원번호 확인 버튼을 눌러주세요.");
            return;
        }
    } else if (year.length < 4 || month.length < 2 || day.length < 2) {
        e.preventDefault();
        alert("생년월일을 0000년 00월 00일 형식으로 작성해주세요.");
        return;
    } 

    const emailSelect = document.querySelector('#email02').value;
    
    if(emailSelect === 'E-mail' || !emailSelect){
        alert("이메일 옵션을 선택해주세요.")
        e.preventDefault();
        return;
    }
});

// =======================================================================