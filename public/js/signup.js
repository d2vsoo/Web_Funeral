/* 생년월일 option 설정 */

/* 출생연도 select box option 목록 동적 생성하기 */
const birth = document.querySelector('#birth');
// option 목록 생성 여부 확인
isYearOptionExisted = false;
// focus : 객체에 포커스가 있을 경우
birth.addEventListener('focus', function(){
    // year 목록이 생성되지 않았을 때 (최초 클릭 시)
    if(!isYearOptionExisted) {
        isYearOptionExisted = true;
        for(var i=1930; i<=2024; i++){
            // option element 생성
            const yearOption = document.createElement('option')
            yearOption.setAttribute('value', i)
            yearOption.innerText = i

            // birth 자식요소로 추가하기
            this.appendChild(yearOption);
        }
    }
});

/* month select box option 목록 동적 생성하기 */
const month = document.querySelector('#month');
// option 목록 생성 여부 확인
isMonthOptionExisted = false;

month.addEventListener('focus', function(){
    if(!isMonthOptionExisted){
        isMonthOptionExisted = true;
        for(var j=1; j<=12; j++){
            // option element 생성
            const monthOption = document.createElement('option')
            monthOption.setAttribute('value', j)
            monthOption.innerText = j

            // month 자식요소 추가
            this.appendChild(monthOption);
        }
    }
});

/* day select box option 목록 동적 생성하기 */
const day = document.querySelector('#day');
// option 목록 생성 여부 확인
isDayOptionExisted = false;

day.addEventListener('focus', function(){
    if(!isDayOptionExisted){
        isDayOptionExisted = true;
        for(var k=1; k<=31; k++){
            //option element 생성
            const dayOption = document.createElement('option');
            dayOption.setAttribute('value', k)
            dayOption.innerText = k

            //day 자식요소 추가하기
            this.appendChild(dayOption);

        }
    }
});

// 아이디 확인 버튼 클릭
document.querySelector('#idCheck').addEventListener('click', function(){

    const userid = document.querySelector('#userid').value;
    console.log(userid);
    const password = document.querySelector('#password').value;
    const password02 = document.querySelector('#password02').value;
    const username = document.querySelector('#name').value;
    const birth = document.querySelector('#birth').value;
    const month = document.querySelector('#month').value;
    const day = document.querySelector('#day').value;
    const num01 = document.querySelector('#num01').value;
    const num02 = document.querySelector('#num02').value;
    const num03 = document.querySelector('#num03').value;
    const email01 = document.querySelector('#email01').value;
    const email02 = document.querySelector('#email02').value;
    const empNum = document.querySelector('#enum').value;

    const korean = /^[ㄱ-ㅎ가-힣]+$/;
    const idText = /^[a-zA-Z0-9]+$/;

    // server.js로 아이디 확인 요청 보내기
    fetch('/checkId', {
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
        // true일 때
        if (data.isAvailable) {
            if (!birth || !month || !day || !email02) {
                alert ("모든 정보를 입력해주세요.")
            } else if (userid.length < 4 || userid.length > 12) {
                alert ("아이디는 총 길이 4~12자로 입력해주세요.")
            } else if (korean.test(userid) || !idText.test(userid)) {
                alert ("영문자와 숫자만 입력 가능합니다.")
            } else {
                alert('사용 가능한 아이디입니다.')
            }
            
        //false 일 때
        } else {
            alert("이미 사용 중인 아이디입니다.")
        }
    })
    .catch(error => {
        console.error('Error', error);
    })
})

// 폼 동작 방지 및 alert 띄우기
document.querySelector('#userForm').addEventListener('submit', async function(e){

    // 폼 제출 방지
    e.preventDefault();

    const formData = new FormData(this);

    const response = await fetch('/signup', {
        method : 'POST',
        body : formData
    })

    const alert = await response.text();
    document.getElementById('alert').innerHTML = alert;

})