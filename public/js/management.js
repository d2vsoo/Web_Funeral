// 추가 버튼 누르면 list input field 추가하기

// 기본
const mournerList = document.querySelector('.mournerList');
const addbtn = document.querySelector('.mourner-add');
const maxList = 20;
let listCount = 1;

// 추가 버튼 클릭 시 이벤트 발생
addbtn.addEventListener('click', function(e){
    // 폼 제출 방지
    e.preventDefault();
    
    if(listCount < maxList){
        listCount++;

        // input 추가하기
        const newInput = document.createElement('input');
        newInput.type = 'text';
        // padStart : 문자열의 길이가 최소 2가 되도록 왼쪽에 0을 채움
        newInput.id = `mourner${String(listCount).padStart(2, '0')}`;
        newInput.name = 'mourner';
        newInput.className = 'mourner';

        // 생성한 input 태그를 mournerList에 추가하기
        mournerList.appendChild(newInput);
    }
})

// =======================================================================

// 폼 제출 버튼을 눌렀을 때, input 입력하지 않으면 폼 제출 방지하기
document.querySelector('#managementForm').addEventListener('submit', function(e){
    const roomSelect = document.querySelector('#room').value;

    const deceased = document.querySelector('#deceased').value;

    const mourner = document.querySelectorAll('.mourner');
    const mournernonbtn = document.querySelector('input[name="nonmourner"]:checked');

    const funeralDate = document.querySelector('#funeralDate').value;
    const datenonbtn = document.querySelector('input[name="nondate"]:checked');

    const funeralTime = document.querySelector('#funeralTime').value;
    const timenonbtn = document.querySelector('input[name="nontime"]:checked');

    const funeralPlace = document.querySelector('#funeralPlace').value;
    const placenonbtn = document.querySelector('input[name="nonplace"]:checked');

    const schedule = document.querySelector('#schedule').value;

    let alertMessage = '';

    // 상주명 빈칸 확인하기

    // 빈칸이 존재하지 않으면 true
    let mournerValid = true;
    mourner.forEach(input => {
        if (input.value.trim() === '') {
            mournerValid = false;
        }
    });

    // 필수 입력값 검증하기
    if (!mournerValid && !mournernonbtn) {
        e.preventDefault();
        alertMessage = '상주 정보를 입력해주세요.';
    } else if (!funeralDate && !datenonbtn) {
        e.preventDefault();
        alertMessage = '발인일자를 입력해주세요.';
    } else if (!funeralTime && !timenonbtn) {
        e.preventDefault();
        alertMessage = '발인시간을 입력해주세요.';
    } else if (!funeralPlace && !placenonbtn) {
        e.preventDefault();
        alertMessage = '장지를 입력해주세요.';
    }

    if (roomSelect === '호실 선택' || !roomSelect || !deceased || !schedule || schedule === '장례일정') {
        e.preventDefault();
        alertMessage = '빈소 정보를 모두 입력해주세요.';
    } 

    // alert 띄우기
    if (alertMessage) {
        alert(alertMessage)
    } else {
        alert("등록되었습니다.")
    }
});