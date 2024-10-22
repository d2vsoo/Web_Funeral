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

// 아이디 중복 확인
document.getElementById('idCheck').addEventListener('click', function(){
    console.log("아이디 확인 버튼 활성화")

    const userid = document.getElementById('userid').value;
    const korean = /^[ㄱ-ㅎ가-힣]+$/;

    if(userid < 4 ){
        alert("아이디를 4글자 이상 작성하세요.")
    } else if (korean.test(userid)){
        alert("영문자와 숫자를 사용해서 작성해주세요.")
    } else {
        alert("사용 가능한 아이디입니다.")
    }
});